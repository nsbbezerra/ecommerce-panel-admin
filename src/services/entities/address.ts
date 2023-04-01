export interface AddressesEntity {
  id: string;
  street: string;
  number: string;
  comp: string | null;
  district: string;
  cep: string;
  city: string;
  state: string;
  created_at: Date;
  default: boolean;
  client_id: string;
}
