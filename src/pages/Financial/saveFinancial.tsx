import { Fragment, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Button from "../../components/layout/Button";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DefaultContainer from "../../components/layout/DefaultContainer";
import InputText from "../../components/layout/InputText";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ptBr from "date-fns/locale/pt-BR";
import { AiOutlineSave } from "react-icons/ai";

export default function SaveFinancial() {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState<Date | null>(null);

  return (
    <Fragment>
      <AppBar title="Novo Movimento Financeiro" />

      <Container>
        <Box p={2}>
          <Button
            startIcon={<FiChevronLeft />}
            onClick={() => navigate("/dashboard/financeiro/movimentos")}
          >
            Voltar
          </Button>

          <Box mt={2}>
            <DefaultContainer disabledPadding>
              <Grid container spacing={2} justifyContent={"flex-end"}>
                <Grid item xs={12} md={4}>
                  <FormControl variant="filled" fullWidth size="small">
                    <InputLabel id="select-type-search">
                      Tipo de Movimentação
                    </InputLabel>
                    <Select
                      labelId="select-type-search"
                      id="select-type-search"
                    >
                      <MenuItem value="">
                        <em>Selecione</em>
                      </MenuItem>
                      <MenuItem value={10}>Receita</MenuItem>
                      <MenuItem value={20}>Despesa</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <InputText label="Título da Movimentação" fullWidth />
                </Grid>

                <Grid item xs={12} md={4}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={ptBr}
                  >
                    <DatePicker
                      label="Data de Vencimento"
                      slotProps={{
                        textField: {
                          variant: "filled",
                          fullWidth: true,
                          size: "small",
                        },
                      }}
                      value={startDate}
                      onChange={(e) => setStartDate(e as Date)}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12}>
                  <InputText
                    multiline
                    fullWidth
                    rows={3}
                    label="Descrição do Movimento"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Button
                    fullWidth
                    size="large"
                    startIcon={<AiOutlineSave />}
                    variant="contained"
                  >
                    Salvar
                  </Button>
                </Grid>
              </Grid>
            </DefaultContainer>
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
}
