export interface ProductOptionsEntity {
  id: string;
  headline: string;
  content: string;
  stock: number | null;
  created_at?: Date;
  product_id?: string | null;
}
