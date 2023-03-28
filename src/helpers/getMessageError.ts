import { blue } from "@mui/material/colors";
import Swal from "sweetalert2";

interface Props {
  error: any;
}

export default function getErrorMessage({ error }: Props) {
  const messageData = error.response?.data.message;
  const errorMessage = error.message;

  function handleMessage(): string {
    if (!messageData && !errorMessage) {
      return "Ocorreu um erro durante o processo";
    } else if (!messageData && errorMessage) {
      return errorMessage;
    } else {
      return messageData;
    }
  }

  return Swal.fire({
    title: "Erro",
    text: handleMessage(),
    confirmButtonColor: blue["500"],
    icon: "error",
  });
}
