import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { Fragment } from "react";
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
        <Box padding={"20px"}>
          <Box
            boxShadow={"0px 0px 9px rgba(0, 0, 0, 0.05)"}
            borderRadius={"4px"}
            overflow={"hidden"}
          >
            <BottomNavigation showLabels value={2}>
              <BottomNavigationAction
                label="Balcão"
                icon={
                  <AiOutlineShoppingCart
                    fontSize={20}
                    style={{ marginBottom: "5px" }}
                  />
                }
                onClick={() => navigate("/dashboard/vendas")}
              />
              <BottomNavigationAction
                label="Concluídas"
                icon={
                  <AiOutlineShopping
                    fontSize={20}
                    style={{ marginBottom: "5px" }}
                  />
                }
                onClick={() => navigate("/dashboard/vendas/finalizadas")}
              />
              <BottomNavigationAction
                label="Salvas"
                icon={
                  <AiOutlineSave
                    fontSize={20}
                    style={{ marginBottom: "5px" }}
                  />
                }
                onClick={() => navigate("/dashboard/vendas/salvas")}
              />
            </BottomNavigation>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
