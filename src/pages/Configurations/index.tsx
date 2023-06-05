import { useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import { Box } from "@mui/material";
import PaymentsConfigsPage from "./payments";
import { MenuContainer, MenuItem } from "../Pdv/styles";
import { IoIosDesktop } from "react-icons/io";
import { MdPayments } from "react-icons/md";
import AppConfigs from "./app";

export default function Configurations() {
  const [alignment, setAlignment] = useState("app");

  return (
    <Box pb={2}>
      <AppBar title="Configurações" />

      <Box px={2}>
        <Container size="lg">
          <Box py={2}>
            <MenuContainer>
              <MenuItem
                active={alignment === "app"}
                onClick={() => setAlignment("app")}
              >
                <IoIosDesktop className="menu-icon" />
                <div className="menu-right">
                  <span className="menu-title">CONFIGURAÇÕES</span>
                  <span className="menu-desc">DO APLICATIVO</span>
                </div>
              </MenuItem>
              <MenuItem
                active={alignment === "payment"}
                onClick={() => setAlignment("payment")}
              >
                <MdPayments className="menu-icon" />
                <div className="menu-right">
                  <span className="menu-title">CONFIGURAÇÕES</span>
                  <span className="menu-desc">DE PAGAMENTOS</span>
                </div>
              </MenuItem>
            </MenuContainer>
          </Box>

          {alignment === "payment" && <PaymentsConfigsPage />}
          {alignment === "app" && <AppConfigs />}
        </Container>
      </Box>
    </Box>
  );
}
