export interface CashierEntity {
  id: string;
  status: "OPENED" | "CLOSED";
  open_date: Date;
  close_date: Date | null;
  open_value: string | number;
  close_value: string | number | null;
  created_at: Date;
}
