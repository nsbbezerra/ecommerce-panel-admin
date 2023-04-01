export interface AddressDto {
  id?: string;
  street: string;
  number: string;
  comp: string | null;
  district: string;
  default: boolean;
  cep: string;
  city: string;
  state: string;
  client_id?: string;
}
