import { Fragment, MouseEvent, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import PaymentsConfigsPage from "./payments";
import EmptyBox from "../../components/layout/EmptyBox";

export default function Configurations() {
  const [alignment, setAlignment] = useState("app");

  const handleChange = (
    event: MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <Fragment>
      <AppBar title="Configurações" />

      <Container size="lg">
        <Box mb={-2}>
          <DefaultContainer>
            <ToggleButtonGroup
              color="primary"
              value={alignment}
              exclusive
              onChange={handleChange}
              aria-label="Platform"
            >
              <ToggleButton value="app">Aplicativo</ToggleButton>
              <ToggleButton value="payment">Pagamentos</ToggleButton>
            </ToggleButtonGroup>
          </DefaultContainer>
        </Box>

        {alignment === "payment" && <PaymentsConfigsPage />}
        {alignment === "app" && (
          <DefaultContainer>
            <EmptyBox label="Nenhuma configuração disponível" />
          </DefaultContainer>
        )}
      </Container>
    </Fragment>
  );
}
