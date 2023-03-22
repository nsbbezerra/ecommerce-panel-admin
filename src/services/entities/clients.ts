export interface GetAllClientsEntity {
  id: string;
  name: string;
  document: string;
  phone: string;
  email: string;
  created_at?: Date | string;
}
