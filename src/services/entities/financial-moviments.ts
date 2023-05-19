export interface FinancialMovimentsEntity {
  id: string;
  title: string;
  mode: "REVENUE" | "EXPENSE";
  description: string;
  payment_status: "WAITING" | "PAID_OUT" | "REFUSED";
  due_date: Date;
  month: string;
  year: string;
  value: string;
  created_at: Date;
}
