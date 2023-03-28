import { blue } from "@mui/material/colors";
import Swal from "sweetalert2";

interface Props {
  message: string;
}

export default function getSuccessMessage({ message }: Props) {
  return Swal.fire({
    title: "Sucesso!",
    text: message,
    confirmButtonColor: blue["500"],
    icon: "success",
  });
}
