import { Fragment, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import { Box, Grid } from "@mui/material";
import DefaultContainer from "../../components/layout/DefaultContainer";
import Button from "../../components/layout/Button";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import InputText from "../../components/layout/InputText";
import currencyMask from "../../helpers/currencyMask";
import { AiOutlineSave } from "react-icons/ai";
import Swal from "sweetalert2";
import { blue } from "@mui/material/colors";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";

export default function OpenCashier() {
  const navigate = useNavigate();

  const [openValue, setOpenValue] = useState<string>("0,00");
  const [openDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  function openCashier() {
    if (openValue === "") {
      Swal.fire({
        title: "Atenção",
        text: "É necessário informar um valor de abertura.",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    setIsLoading(true);
    api
      .post("/cashier/open", {
        cashier: {
          open_date: openDate,
          open_value: openValue.replace(".", "").replace(",", "."),
        },
      })
      .then((response) => {
        setIsLoading(false);
        Swal.fire({
          title: "Sucesso",
          text: response.data.message,
          icon: "success",
          confirmButtonColor: blue["500"],
        }).then((results) => {
          if (results.isConfirmed) {
            navigate("/dashboard/caixa");
          }
        });
      })
      .catch((error) => {
        setIsLoading(false);
        getErrorMessage({ error });
      });
  }

  return (
    <Fragment>
      <AppBar title="Abrir Caixa" />

      <Container>
        <Box p={2}>
          <Button
            startIcon={<FiChevronLeft />}
            onClick={() => navigate("/dashboard/caixa")}
            sx={{ mb: 2 }}
          >
            Voltar
          </Button>
          <DefaultContainer disabledPadding>
            <Grid container spacing={2} alignItems={"center"}>
              <Grid item xs={12} sm={7} md={8} lg={9}>
                <InputText
                  label="Valor de Abertura (R$)"
                  fullWidth
                  value={currencyMask(openValue)}
                  onChange={(e) => setOpenValue(currencyMask(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} sm={5} md={4} lg={3}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<AiOutlineSave />}
                  loading={isLoading}
                  onClick={openCashier}
                >
                  Salvar
                </Button>
              </Grid>
            </Grid>
          </DefaultContainer>
        </Box>
      </Container>
    </Fragment>
  );
}
