export interface Product {
  id?: string;
  externalId?: string;
  name: string;
  image: string;
  originalPrice: string;
  discountPrice: string;
  numericPrice?: number;
  category?: string;
  badge?: string;
  affiliateUrl: string;
  discountPercent?: string;
  soldCount?: string;
  numericSoldCount?: number;
  ratingCount?: string;
  likesCount?: string;
  ratingScore?: string;
  createdAt?: string;
  searchName?: string;
  videoUrl?: string;
}

export interface CategoryItem {
  id?: string;
  name: string;
  image: string;
  count: number;
}

export interface AppConfig {
  HERO_TITLE?: string;
  HERO_SUBTITLE?: string;
  HERO_BG_URL?: string;
  SHOW_VOUCHERS?: boolean;
  SHOW_MALL_ONLY?: boolean;
  GOOGLE_SHEET_ID?: string;
  GOOGLE_SHEET_GID?: string;
}

export type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'discount';
