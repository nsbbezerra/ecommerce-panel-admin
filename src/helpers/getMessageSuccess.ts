import Swal from "sweetalert2";

interface Props {
  message: string;
}

export default function getSuccessMessage({ message }: Props) {
  return Swal.fire({
    title: "Sucesso!",
    text: message,
    confirmButtonColor: "var(--primary-color)",
    icon: "success",
  });
}
