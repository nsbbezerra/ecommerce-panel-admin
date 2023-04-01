import { Autocomplete, Box, Grid } from "@mui/material";
import { Fragment } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AppBar from "../../components/layout/AppBar";
import Button from "../../components/layout/Button";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import InputText from "../../components/layout/InputText";

export default function SaveSubCategory() {
  const navigate = useNavigate();

  return (
    <Fragment>
      <AppBar title="Nova Sub-categoria" />
      <Container>
        <Box
          padding={"20px"}
          mb={-2}
          display="flex"
          justifyContent={"space-between"}
          alignItems="center"
          gap={2}
        >
          <Button
            onClick={() => navigate("/dashboard/sub-categorias")}
            startIcon={<FiChevronLeft />}
          >
            VOLTAR
          </Button>
        </Box>

        <DefaultContainer>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent={"flex-end"}
          >
            <Grid item xs={12} md={4} lg={4}>
              <Autocomplete
                disablePortal
                id="categories"
                options={[]}
                renderInput={(params) => (
                  <InputText
                    {...params}
                    label="Categoria"
                    fullWidth
                    autoFocus
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={5} lg={6}>
              <InputText label="Nome" fullWidth />
            </Grid>
            <Grid item xs={12} sm={5} md={3} lg={2}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<AiOutlineSave />}
              >
                salvar
              </Button>
            </Grid>
          </Grid>
        </DefaultContainer>
      </Container>
    </Fragment>
  );
}
