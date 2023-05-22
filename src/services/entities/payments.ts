export interface PaymentsEntity {
  id: string;
  order_id: string;
  total: string;
  due_date: Date;
  status: "PAID_OUT" | "WAITING" | "REFUSED";
  pay_form: string;
  month: string;
  year: string;
}

export interface PaymentsWithRelatioshipEntity {
  id: string;
  order: { code: string; client: { name: string } };
  total: string;
  due_date: Date;
  status: "PAID_OUT" | "WAITING" | "REFUSED";
  pay_form: string;
  month: string;
  year: string;
}
