export interface ProductsDto {
  name: string;
  slug: string;
  code: string;
  active: boolean;
  short_description: string;
  description?: string;
  price: number | string;
  shipping_info: {
    width: number;
    lenght: number;
    height: number;
    weight: number;
  };
  freight_priority: string;
  category_id: string;
  collection_id: string;
  stock_type: string;
  stock?: number | null;
}

export interface ProductOptionsDto {
  headline: string;
  content: string;
  stock: number;
  product_id?: string;
}

export interface OrderItemsDto {
  id: string;
  quantity: number;
  price: string | number;
  actual_stock: number;
  stock_type: string;
  created_at?: Date;
  product_id: string;
  product_name: string;
  product_options_id: string | null;
  product_options_label: string;
}
