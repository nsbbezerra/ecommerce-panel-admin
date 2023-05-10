import { LoadingContainer } from "./style";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
  return (
    <LoadingContainer>
      <CircularProgress
        style={{ width: "40px", height: "40px" }}
        color="inherit"
      />
      <span>Carregando...</span>
    </LoadingContainer>
  );
}
