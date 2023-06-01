import { AddressesEntity } from "./address";
import { ProductOptionsEntity } from "./productOptions";

interface ClientProps {
  name: string;
  id: string;
  phone: string;
  email: string;
  Addresses: AddressesEntity[];
}

interface ProductProps {
  category: { name: string; id: string } | null;
  collection: { name: string; id: string } | null;
  supplier: { name: string; id: string } | null;
  id: string;
  name: string;
  code: string | null;
  thumbnail: string | null;
}

interface OrderItemsProps {
  id: string;
  price: string | number;
  product: ProductProps;
  quantity: number;
  product_options: ProductOptionsEntity | null;
}

export interface PaymentLocalIntentProps {
  id: string;
  order_id: string;
  total: string | number;
  due_date: Date;
  status: "WAITING" | "PAID_OUT" | "REFUSED";
  pay_form: string;
  month: string;
  year: string;
}

export interface GetOrderByIdEntity {
  checkout_id: string | null;
  client: ClientProps;
  code: string;
  discount: string | number;
  id: string;
  created_at: Date | string;
  order_status: string;
  payment_status: "WAITING" | "PAID_OUT" | "REFUSED";
  payment_mode: "LOCAL" | "ONLINE";
  pay_form: string;
  installments: number;
  mode: string;
  payment_id: string | null;
  sub_total: string | number;
  shipping_code: string | null;
  shipping_tracking_url: string | null;
  total: string | number;
  shipping_value: string | number;
  shipping_id: string | null;
  OrderItems: OrderItemsProps[];
  PaymentLocalIntent: PaymentLocalIntentProps[];
  order_from: string;
}
