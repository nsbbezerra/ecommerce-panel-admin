import { Fragment } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import { Box, Grid } from "@mui/material";
import Button from "../../components/layout/Button";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DefaultContainer from "../../components/layout/DefaultContainer";
import InputText from "../../components/layout/InputText";
import { AiOutlineSave } from "react-icons/ai";
import Upload from "../../components/layout/Upload";

export default function SaveSupplier() {
  const navigate = useNavigate();

  return (
    <Fragment>
      <AppBar title="Criar Marca" />

      <Container>
        <Box padding={"20px"} mb={-2}>
          <Button
            startIcon={<FiChevronLeft />}
            onClick={() => navigate("/dashboard/marcas")}
          >
            Voltar
          </Button>
        </Box>

        <DefaultContainer>
          <Grid container spacing={2} alignItems={"center"}>
            <Grid item xs={12} sm={8} md={9} lg={10}>
              <InputText label="Nome" fullWidth autoFocus />
            </Grid>
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <Button
                fullWidth
                startIcon={<AiOutlineSave />}
                variant="contained"
                size="large"
                type="submit"
              >
                Salvar
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Upload id="" name="" to="supplier" disabled />
            </Grid>
          </Grid>
        </DefaultContainer>
      </Container>
    </Fragment>
  );
}
