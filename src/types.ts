export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  imageUrl?: string;
  gallery?: string[];
  videoUrl?: string;
  publishedAt: any;
  featured?: boolean;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: any;
  location: string;
  type: 'mission' | 'campaign' | 'general';
  imageUrl?: string;
  gallery?: string[];
  videoUrl?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  interests?: string;
  status: 'pending' | 'contacted' | 'active';
  createdAt: any;
}

export interface Partner {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  website?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  phone?: string;
  address?: string;
}
