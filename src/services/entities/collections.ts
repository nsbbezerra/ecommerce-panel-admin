export interface CollectionsWithRelationshipEntity {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  created_at: Date;
  category_id: string;
  category: {
    id: string;
    name: string;
  };
}
