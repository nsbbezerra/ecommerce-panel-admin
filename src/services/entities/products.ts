import { ProductOptionsEntity } from "./productOptions";

export interface ProductsEntity {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  short_description: string | null;
  thumbnail: string | null;
  description: string;
  price: string | number;
  request: number;
  promotional: boolean;
  promo_rate: number;
  shipping_info: {
    width: number;
    lenght: number;
    height: number;
    weight: number;
  };
  freight_priority: string;
  created_at: Date;
  category_id: string;
  collection_id: string;
  stock_type?: string | null;
  stock?: number | null;
}

export interface ProductsWithRelationshipEntity {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  code: string;
  short_description: string | null;
  thumbnail: string | null;
  thumbnail_id: string | null;
  description: string;
  price: string | number;
  request: number;
  promotional: boolean;
  promo_rate: number;
  shipping_info: {
    width: number;
    lenght: number;
    height: number;
    weight: number;
  };
  freight_priority: "FAST" | "NORMAL";
  created_at: Date;
  category: { id: string; name: string } | null;
  collection: { id: string; name: string } | null;
  supplier: { id: string; name: string } | null;
  stock_type?: string | null;
  stock?: number | null;
  ProductOptions: ProductOptionsEntity[];
}
