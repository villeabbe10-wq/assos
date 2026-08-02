/**
 * Utility for caching awareness banners and images locally in browser CacheStorage & Blob store.
 * Ensures health awareness banners load instantly and remain available offline.
 */

const CACHE_NAME = 'seducep-awareness-banners-v1';
const MEMORY_BLOB_CACHE = new Map<string, string>();

/**
 * Checks if CacheStorage is supported in current environment
 */
export function isCacheSupported(): boolean {
  return typeof window !== 'undefined' && 'caches' in window;
}

/**
 * Pre-cache a single image URL into CacheStorage and memory Blob store.
 */
export async function cacheBannerImage(url: string): Promise<string> {
  if (!url) return url;

  // Return existing memory blob if available
  if (MEMORY_BLOB_CACHE.has(url)) {
    return MEMORY_BLOB_CACHE.get(url)!;
  }

  if (!isCacheSupported()) {
    return url;
  }

  try {
    const cache = await caches.open(CACHE_NAME);
    let response = await cache.match(url);

    if (!response) {
      // Fetch and store in cache
      const fetchResponse = await fetch(url, { mode: 'cors' });
      if (fetchResponse.ok) {
        await cache.put(url, fetchResponse.clone());
        response = fetchResponse;
      } else {
        return url;
      }
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    MEMORY_BLOB_CACHE.set(url, objectUrl);
    return objectUrl;
  } catch (error) {
    console.warn(`[BannerCache] Failed to cache image ${url}:`, error);
    return url;
  }
}

/**
 * Batch cache multiple banner images with progress tracking.
 */
export async function cacheAllBannerImages(
  urls: string[],
  onProgress?: (cachedCount: number, total: number) => void
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};
  let count = 0;

  for (const url of urls) {
    try {
      const cachedUrl = await cacheBannerImage(url);
      results[url] = cachedUrl;
      count++;
      if (onProgress) {
        onProgress(count, urls.length);
      }
    } catch {
      results[url] = url;
    }
  }

  return results;
}

/**
 * Check if an image URL is currently cached.
 */
export async function isImageCached(url: string): Promise<boolean> {
  if (MEMORY_BLOB_CACHE.has(url)) return true;
  if (!isCacheSupported()) return false;

  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(url);
    return !!response;
  } catch {
    return false;
  }
}

/**
 * Get cached count and list of cached URLs.
 */
export async function getBannerCacheStats(urls: string[]): Promise<{ cachedCount: number; total: number; isFullyCached: boolean }> {
  let cachedCount = 0;
  for (const url of urls) {
    if (await isImageCached(url)) {
      cachedCount++;
    }
  }
  return {
    cachedCount,
    total: urls.length,
    isFullyCached: urls.length > 0 && cachedCount === urls.length,
  };
}

/**
 * Clear the banner cache storage.
 */
export async function clearBannerCache(): Promise<void> {
  MEMORY_BLOB_CACHE.clear();
  if (isCacheSupported()) {
    try {
      await caches.delete(CACHE_NAME);
    } catch (err) {
      console.warn('[BannerCache] Error clearing cache:', err);
    }
  }
}
