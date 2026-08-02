import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  X, 
  HardDrive, 
  Info,
  RefreshCw,
  HeartPulse,
  Droplets,
  Stethoscope,
  Baby,
  Apple
} from 'lucide-react';
import { cacheAllBannerImages, getBannerCacheStats, cacheBannerImage } from '../lib/bannerCache';

export interface AwarenessBannerItem {
  id: string;
  title: string;
  category: 'Paludisme' | 'Hygiène' | 'Dépistage' | 'Santé Maternelle' | 'Nutrition';
  imageUrl: string;
  badge: string;
  description: string;
  keyPoints: string[];
  campaignDate: string;
}

export const INITIAL_AWARENESS_BANNERS: AwarenessBannerItem[] = [
  {
    id: 'banner-sensibilisation-main',
    title: 'Sensibilisation Nationale : Prévention & Santé pour Tous',
    category: 'Paludisme',
    badge: 'Mouvement Solidaire Togo',
    imageUrl: '/images/publications/bannier/sensibilisation.jpg',
    description: 'Bannière officielle de sensibilisation sur le terrain. Remplacez le fichier dans "public/images/publications/bannier/sensibilisation.jpg" pour actualiser automatiquement l’image.',
    keyPoints: [
      'Sensibiliser, éduquer et protéger les populations vulnérables',
      'Missions de dépistage gratuit et distribution de kits sanitaires',
      'Accompagnement médical de proximité à travers le Togo'
    ],
    campaignDate: 'Affiche Officielle SEDUCEP'
  },
  {
    id: 'banner-palu-1',
    title: 'Prévention du Paludisme : Protections & Moustiquaires',
    category: 'Paludisme',
    badge: 'Campagne Nationale Togo',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200',
    description: 'Le paludisme reste une priorité de santé publique au Togo. Protégez votre famille en adoptant les bons gestes au quotidien.',
    keyPoints: [
      'Dormir chaque nuit sous moustiquaire imprégnée d’insecticide (MILD)',
      'Éliminer les eaux stagnantes autour des habitations',
      'Consulter immédiatement un centre médical dès l’apparition de fièvre'
    ],
    campaignDate: 'Sensibilisation 2026'
  },
  {
    id: 'banner-depistage-1',
    title: 'Dépistage Précoce : Prévenir pour Mieux Soigner',
    category: 'Dépistage',
    badge: 'Santé Communautaire',
    imageUrl: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=1200',
    description: 'Nos équipes mobiles effectuent des bilans de santé gratuits (tension, diabète, paludisme) dans les villages vulnérables.',
    keyPoints: [
      'Contrôle gratuit de la tension artérielle et glycémie',
      'Diagnostic rapide du paludisme en moins de 15 minutes',
      'Conseils personnalisés par des professionnels de santé'
    ],
    campaignDate: 'Action Terrain Togo'
  },
  {
    id: 'banner-hygiene-1',
    title: 'Hygiène des Mains & Eau Potable en Milieu Rural',
    category: 'Hygiène',
    badge: 'Prévention & Eau',
    imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=1200',
    description: 'L’accès à une eau propre et l’apprentissage des gestes d’hygiène réduisent de 50% les maladies diarrhéiques chez les enfants.',
    keyPoints: [
      'Lavage fréquent des mains avec de l’eau propre et du savon',
      'Purification et conservation sécurisée de l’eau de boisson',
      'Maintien de la propreté dans les foyers et écoles'
    ],
    campaignDate: 'Santé Publique'
  },
  {
    id: 'banner-maternite-1',
    title: 'Suivi Prénatal & Santé Maternelle',
    category: 'Santé Maternelle',
    badge: 'Mères & Enfants',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    description: 'Accompagner chaque future mère pour des accouchements sécurisés et des enfants en pleine santé.',
    keyPoints: [
      'Effectuer au moins 4 consultations prénatales au centre de santé',
      'Vaccination de la mère et supplémentation en fer/acide folique',
      'Sensibilisation à l’allaitement maternel exclusif pendant 6 mois'
    ],
    campaignDate: 'Protection Maternelle'
  },
  {
    id: 'banner-nutrition-1',
    title: 'Nutrition Équilibrée & Lutte Contre la Malnutrition',
    category: 'Nutrition',
    badge: 'Éducation Nutritionnelle',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200',
    description: 'Promouvoir les produits locaux riches en nutriments pour la croissance saine des enfants togolais.',
    keyPoints: [
      'Valorisation de la bouillie enrichie locale',
      'Inclusion systématique de légumes verts et protéines locales',
      'Suivi régulier de la courbe de croissance chez les jeunes enfants'
    ],
    campaignDate: 'Nutrition Solidarité'
  }
];

export default function AwarenessBanners() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeLightbox, setActiveLightbox] = useState<AwarenessBannerItem | null>(null);
  
  // Cache state
  const [cacheStats, setCacheStats] = useState<{ cachedCount: number; total: number; isFullyCached: boolean }>({
    cachedCount: 0,
    total: INITIAL_AWARENESS_BANNERS.length,
    isFullyCached: false
  });
  const [isCaching, setIsCaching] = useState(false);
  const [cacheProgress, setCacheProgress] = useState(0);
  const [cachedUrlsMap, setCachedUrlsMap] = useState<Record<string, string>>({});

  const allImageUrls = INITIAL_AWARENESS_BANNERS.map(b => b.imageUrl);

  // Filter banners
  const filteredBanners = selectedCategory === 'Tous'
    ? INITIAL_AWARENESS_BANNERS
    : INITIAL_AWARENESS_BANNERS.filter(b => b.category === selectedCategory);

  // Check initial cache status & load cached blob URLs
  useEffect(() => {
    let isMounted = true;

    async function checkCacheStatus() {
      const stats = await getBannerCacheStats(allImageUrls);
      if (isMounted) {
        setCacheStats(stats);
      }

      // Try silently pre-caching or getting existing cached URLs
      const map: Record<string, string> = {};
      for (const item of INITIAL_AWARENESS_BANNERS) {
        const cachedUrl = await cacheBannerImage(item.imageUrl);
        map[item.id] = cachedUrl;
      }
      if (isMounted) {
        setCachedUrlsMap(map);
      }
    }

    checkCacheStatus();
    return () => { isMounted = false; };
  }, []);

  // Handle manual cache trigger
  const handleCacheAllBanners = async () => {
    setIsCaching(true);
    setCacheProgress(0);

    const map: Record<string, string> = {};
    const result = await cacheAllBannerImages(allImageUrls, (count, total) => {
      setCacheProgress(Math.round((count / total) * 100));
    });

    for (const item of INITIAL_AWARENESS_BANNERS) {
      map[item.id] = result[item.imageUrl] || item.imageUrl;
    }

    setCachedUrlsMap(map);
    const updatedStats = await getBannerCacheStats(allImageUrls);
    setCacheStats(updatedStats);
    setIsCaching(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredBanners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredBanners.length) % filteredBanners.length);
  };

  const currentBanner = filteredBanners[currentIndex] || filteredBanners[0];
  const displayImageUrl = (currentBanner && cachedUrlsMap[currentBanner.id]) || currentBanner?.imageUrl;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Paludisme': return <HeartPulse className="text-emerald-500" size={16} />;
      case 'Hygiène': return <Droplets className="text-sky-500" size={16} />;
      case 'Dépistage': return <Stethoscope className="text-teal-500" size={16} />;
      case 'Santé Maternelle': return <Baby className="text-pink-500" size={16} />;
      case 'Nutrition': return <Apple className="text-amber-500" size={16} />;
      default: return <Sparkles className="text-emerald-500" size={16} />;
    }
  };

  return (
    <section id="bannieres-sensibilisation" className="bg-slate-900 text-white rounded-[3rem] p-6 sm:p-12 relative overflow-hidden shadow-2xl border border-slate-800">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Cache Controls */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border border-emerald-500/30">
              <ShieldCheck size={14} /> Sensibilisation & Clichés Santé
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-semibold">
              <HardDrive size={13} className="text-sky-400" /> Support Hors-ligne
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Bannières d'Éducation Médicale <span className="text-emerald-400">&</span> Prévention
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Affiches et repères visuels officiels de SEDUCEP Togo. Mises en cache automatique sur votre appareil pour une consultation fluide même sans connexion Internet.
          </p>
        </div>

        {/* Offline Cache Status & Button */}
        <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 flex flex-col gap-2 min-w-[280px]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <HardDrive size={14} className={cacheStats.isFullyCached ? 'text-emerald-400' : 'text-amber-400'} />
              Mise en cache locale
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              {cacheStats.cachedCount}/{cacheStats.total} Bannières
            </span>
          </div>

          {cacheStats.isFullyCached ? (
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
              <CheckCircle2 size={16} /> 100% Téléchargé & Disponible Hors-Ligne
            </div>
          ) : (
            <button
              onClick={handleCacheAllBanners}
              disabled={isCaching}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {isCaching ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Mise en cache ({cacheProgress}%)
                </>
              ) : (
                <>
                  <Download size={14} />
                  Sauvegarder les Bannières en Cache
                </>
              )}
            </button>
          )}

          {isCaching && (
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
              <div 
                className="bg-emerald-400 h-full transition-all duration-300"
                style={{ width: `${cacheProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="relative z-10 flex items-center gap-2 overflow-x-auto py-6 scrollbar-none">
        {['Tous', 'Paludisme', 'Dépistage', 'Hygiène', 'Santé Maternelle', 'Nutrition'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentIndex(0);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-105'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            {getCategoryIcon(cat)}
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Banner Showcase */}
      {currentBanner && (
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-950/60 p-6 sm:p-8 rounded-[2.5rem] border border-slate-800/80 shadow-inner">
          {/* Banner Image Display */}
          <div className="lg:col-span-7 relative group rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 border border-slate-800">
            <motion.img
              key={currentBanner.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              src={displayImageUrl}
              referrerPolicy="no-referrer"
              alt={currentBanner.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e: any) => {
                e.target.src = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200';
              }}
            />

            {/* Top Badge Overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="bg-slate-900/90 backdrop-blur-md text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-emerald-500/30">
                {currentBanner.badge}
              </span>
              <span className="bg-slate-900/90 backdrop-blur-md text-slate-300 text-[10px] font-bold px-3 py-1.5 rounded-full border border-slate-700">
                {currentBanner.campaignDate}
              </span>
            </div>

            {/* Click to Zoom Overlay Button */}
            <button
              onClick={() => setActiveLightbox(currentBanner)}
              className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white font-black text-xs uppercase tracking-widest backdrop-blur-[2px] cursor-pointer"
            >
              <ZoomIn size={22} className="text-emerald-400" /> Afficher la Bannière en Grand
            </button>
          </div>

          {/* Banner Details & Key Points */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                {getCategoryIcon(currentBanner.category)}
                Catégorie : {currentBanner.category}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {currentBanner.title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {currentBanner.description}
              </p>
            </div>

            {/* Key Action Points */}
            <div className="space-y-3 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Info size={14} className="text-emerald-400" /> Recommandations Clés
              </span>
              <ul className="space-y-2.5">
                {currentBanner.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Controls & Pagination */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all cursor-pointer"
                  title="Précédent"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all cursor-pointer"
                  title="Suivant"
                >
                  <ChevronRight size={20} />
                </button>
                <span className="text-xs text-slate-400 font-mono ml-2">
                  {currentIndex + 1} / {filteredBanners.length}
                </span>
              </div>

              <button
                onClick={() => setActiveLightbox(currentBanner)}
                className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                <ZoomIn size={16} /> Vue Plein Écran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightbox(null)}
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-10 cursor-zoom-out"
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveLightbox(null);
              }}
              className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-all shadow-2xl z-20 cursor-pointer"
              title="Fermer (Échap)"
            >
              <X size={28} />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col cursor-default"
            >
              <div className="relative aspect-[16/9] sm:aspect-[16/8] bg-slate-950 overflow-hidden">
                <img
                  src={cachedUrlsMap[activeLightbox.id] || activeLightbox.imageUrl}
                  alt={activeLightbox.title}
                  className="w-full h-full object-contain"
                  onError={(e: any) => {
                    e.target.src = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200';
                  }}
                />
              </div>

              <div className="p-6 sm:p-8 space-y-4 bg-slate-900 border-t border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                      Bannière d'Information - SEDUCEP Togo
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                      {activeLightbox.title}
                    </h3>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full border border-emerald-500/30">
                    {activeLightbox.badge}
                  </span>
                </div>

                <p className="text-slate-300 text-sm">
                  {activeLightbox.description}
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 border-t border-slate-800">
                  <span className="flex items-center gap-1.5 font-mono text-emerald-400">
                    <CheckCircle2 size={15} /> Bannière mise en cache locale (Disponible hors-ligne)
                  </span>
                  <button
                    onClick={() => setActiveLightbox(null)}
                    className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
