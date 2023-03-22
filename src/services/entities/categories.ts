export interface CategoriesEntity {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  thumbnail?: string | null;
  thumbnail_id?: string | null;
  created_at?: Date;
}
