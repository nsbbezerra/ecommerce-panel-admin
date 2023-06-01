export interface CashierEntity {
  id: string;
  status: "OPENED" | "CLOSED";
  open_date: Date;
  close_date: Date | null;
  open_value: string | number;
  close_value: string | number | null;
  created_at: Date;
}

export interface Orders {
  id: string;
  client: Client;
  payment_status: "WAITING" | "PAID_OUT" | "REFUSED";
  pay_form: string | null;
  code: string;
  total: string;
  sub_total: string;
  discount: string;
  installments: number | null;
}

interface Client {
  name: string;
}

export interface OrdersCalc {
  _sum: Sum;
  pay_form: string | null;
}

interface Sum {
  sub_total: string | null;
}

export interface CashHandling {
  id: string;
  description: string;
  value: string;
  type: "DEPOSIT" | "WITHDRAW";
  cashier_id: string;
  created_at: Date;
}

export interface CashierReportResponse {
  orders: Orders[];
  ordersCalc: OrdersCalc[];
  moviments: CashHandling[];
  cashier: CashierEntity | null;
}
