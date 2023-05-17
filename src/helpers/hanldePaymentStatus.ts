import { ChipPropsColorOverrides } from "@mui/material";
import { orange } from "@mui/material/colors";

export default function handlePaymentStatus(status: string): {
  label: string;
  color:
    | "error"
    | "success"
    | "warning"
    | "info"
    | "default"
    | "primary"
    | "secondary";
} {
  switch (status) {
    case "WAITING":
      return { label: "Processando", color: "warning" };
    case "PAID_OUT":
      return { label: "Pago", color: "success" };
    case "REFUSED":
      return { label: "Recusado", color: "error" };
    default:
      return { label: "Processando", color: "warning" };
  }
}
