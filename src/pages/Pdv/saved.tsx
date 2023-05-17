import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineSave,
  AiOutlineShopping,
  AiOutlineShoppingCart,
} from "react-icons/ai";

export default function SalesSaved() {
  const navigate = useNavigate();

  return (
    <Box>
      <AppBar title="Vendas Salvas" />
      <Container>
        <Box p={2}>
          <Box
            boxShadow={"0px 0px 9px rgba(0, 0, 0, 0.05)"}
            borderRadius={"4px"}
            overflow={"hidden"}
            p={1}
            bgcolor={"#fff"}
            sx={{ overflowX: "auto" }}
          >
            <ToggleButtonGroup
              color="primary"
              exclusive
              aria-label="Platform"
              value={"save"}
            >
              <ToggleButton
                sx={{ flexShrink: 0 }}
                value="pdv"
                onClick={() => navigate("/dashboard/vendas")}
              >
                <AiOutlineShoppingCart style={{ marginRight: "10px" }} />
                BALCÃO DE VENDAS
              </ToggleButton>
              <ToggleButton
                sx={{ flexShrink: 0 }}
                value="finish"
                onClick={() => navigate("/dashboard/vendas/finalizadas")}
              >
                <AiOutlineShopping style={{ marginRight: "10px" }} />
                VENDAS FINALIZADAS
              </ToggleButton>
              <ToggleButton sx={{ flexShrink: 0 }} value="save">
                <AiOutlineSave style={{ marginRight: "10px" }} />
                VENDAS SALVAS
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
