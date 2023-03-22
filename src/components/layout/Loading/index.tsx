import { LoadingContainer } from "./style";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Loading() {
  return (
    <LoadingContainer>
      <ProgressSpinner style={{ width: "60px", height: "60px" }} />
      <span>Carregando...</span>
    </LoadingContainer>
  );
}
