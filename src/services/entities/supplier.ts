export interface SupplierEntity {
  id: string;
  active: boolean;
  thumbnail: string | null;
  thumbnail_id: string | null;
  name: string;
  created_at: Date;
}
