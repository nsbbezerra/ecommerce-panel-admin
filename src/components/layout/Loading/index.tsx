import { LoadingContainer } from "./style";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
  return (
    <LoadingContainer>
      <CircularProgress style={{ width: "60px", height: "60px" }} />
      <span>Carregando...</span>
    </LoadingContainer>
  );
}
