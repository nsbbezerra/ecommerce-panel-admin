import { blue } from "@mui/material/colors";
import Swal from "sweetalert2";
import {} from "react-router-dom";

interface Props {
  error: any;
}

export default function getErrorMessage({ error }: Props) {
  const messageData = error.response?.data.message;
  const errorMessage = error.message;
  const status = error.response.status;

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
  }).then((results) => {
    if (results.isConfirmed && status === 401) {
      window.location.href = "/";
      localStorage.removeItem("token");
    }
  });
}
