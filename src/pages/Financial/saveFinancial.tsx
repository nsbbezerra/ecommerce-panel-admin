import { Fragment, useEffect, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import {
  Backdrop,
  Box,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Button from "../../components/layout/Button";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import DefaultContainer from "../../components/layout/DefaultContainer";
import InputText from "../../components/layout/InputText";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ptBr from "date-fns/locale/pt-BR";
import { AiOutlineSave } from "react-icons/ai";
import Swal from "sweetalert2";
import { blue } from "@mui/material/colors";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import currencyMask from "../../helpers/currencyMask";
import formatCurrency from "../../helpers/formatCurrency";

interface FormProps {
  title: string;
  mode: string;
  description: string;
  payment_status: string;
  value: string;
  due_date?: Date;
}

export default function SaveFinancial() {
  const navigate = useNavigate();

  const { moviment } = useParams();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [backdrop, setBackdrop] = useState<boolean>(false);
  const [formType, setFormType] = useState<"add" | "edit">("add");

  const [formulary, setFormulary] = useState<FormProps>({
    description: "",
    mode: "",
    title: "",
    payment_status: "",
    value: "",
  });

  function saveMovement() {
    if (formulary.description === "") {
      Swal.fire({
        title: "Atenção",
        text: "Insira uma descrição para a movimentação",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (formulary.mode === "") {
      Swal.fire({
        title: "Atenção",
        text: "Selecione um tipo de movimentação",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (formulary.title === "") {
      Swal.fire({
        title: "Atenção",
        text: "Insira um título para a movimentação",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (startDate === null) {
      Swal.fire({
        title: "Atenção",
        text: "Selecione uma data de vencimento",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (formulary.value === "") {
      Swal.fire({
        title: "Atenção",
        text: "Insira um valor para a movimentação",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (formulary.payment_status === "") {
      Swal.fire({
        title: "Atenção",
        text: "Selecione um status do pagamento",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }

    if (formType === "add") {
      setIsLoading(true);
      api
        .post("/financial-movements/save", {
          financial: {
            title: formulary.title,
            mode: formulary.mode,
            description: formulary.description,
            payment_status: formulary.payment_status,
            due_date: startDate,
            month: new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
              startDate
            ),
            year: startDate.getFullYear().toString(),
            value: formulary.value.replace(".", "").replace(",", "."),
          },
        })
        .then((response) => {
          setIsLoading(false);
          Swal.fire({
            title: "Sucesso",
            text: response.data.message,
            icon: "success",
            confirmButtonColor: blue["500"],
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/dashboard/financeiro/movimentos");
            }
          });
        })
        .catch((error) => {
          setIsLoading(false);
          getErrorMessage({ error });
        });
    } else {
      api
        .put("/financial-movements/update", {
          financial: {
            id: moviment,
            title: formulary.title,
            mode: formulary.mode,
            description: formulary.description,
            payment_status: formulary.payment_status,
            due_date: startDate,
            month: new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
              startDate
            ),
            year: startDate.getFullYear().toString(),
            value: formulary.value.replace(".", "").replace(",", "."),
          },
        })
        .then((response) => {
          setIsLoading(false);
          Swal.fire({
            title: "Sucesso",
            text: response.data.message,
            icon: "success",
            confirmButtonColor: blue["500"],
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/dashboard/financeiro/movimentos");
            }
          });
        })
        .catch((error) => {
          setIsLoading(false);
          getErrorMessage({ error });
        });
    }
  }

  function getFinancialMovimentById() {
    setBackdrop(true);
    api
      .get(`/financial-movements/get-by-id/${moviment}`)
      .then((response) => {
        setBackdrop(false);
        const catchMoviment: FormProps = response.data;
        setFormulary({
          description: catchMoviment.description,
          mode: catchMoviment.mode,
          payment_status: catchMoviment.payment_status,
          title: catchMoviment.title,
          value: formatCurrency(catchMoviment.value, "withoutSign") as string,
        });
        setStartDate(new Date(catchMoviment.due_date as Date));
      })
      .catch((error) => {
        setBackdrop(false);
        getErrorMessage({ error });
      });
  }

  useEffect(() => {
    if (moviment) {
      getFinancialMovimentById();
      setFormType("edit");
    }
  }, [moviment]);

  return (
    <Fragment>
      <AppBar title={`${moviment ? "Editar" : "Novo"} Movimento Financeiro`} />

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
              <Grid
                container
                spacing={2}
                justifyContent={"flex-end"}
                alignItems={"center"}
              >
                <Grid item xs={12}>
                  <InputText
                    multiline
                    fullWidth
                    rows={3}
                    label="Descrição do Movimento"
                    value={formulary.description}
                    onChange={(e) =>
                      setFormulary({
                        ...formulary,
                        description: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl variant="filled" fullWidth size="small">
                    <InputLabel id="select-type-search">
                      Tipo de Movimentação
                    </InputLabel>
                    <Select
                      labelId="select-type-search"
                      id="select-type-search"
                      value={formulary.mode}
                      onChange={(e) =>
                        setFormulary({ ...formulary, mode: e.target.value })
                      }
                    >
                      <MenuItem value="">
                        <em>Selecione</em>
                      </MenuItem>
                      <MenuItem value={"REVENUE"}>Receita</MenuItem>
                      <MenuItem value={"EXPENSE"}>Despesa</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <InputText
                    label="Título da Movimentação"
                    fullWidth
                    value={formulary.title}
                    onChange={(e) =>
                      setFormulary({ ...formulary, title: e.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
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

                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <InputText
                    label="Valor (R$)"
                    fullWidth
                    value={currencyMask(formulary.value as string)}
                    onChange={(e) =>
                      setFormulary({
                        ...formulary,
                        value: currencyMask(e.target.value),
                      })
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormControl variant="filled" fullWidth size="small">
                    <InputLabel id="select-payment-status">
                      Status do Pagamento
                    </InputLabel>
                    <Select
                      labelId="select-payment-status"
                      id="select-payment-status"
                      value={formulary.payment_status}
                      onChange={(e) =>
                        setFormulary({
                          ...formulary,
                          payment_status: e.target.value,
                        })
                      }
                    >
                      <MenuItem value="">
                        <em>Selecione</em>
                      </MenuItem>
                      <MenuItem value={"PAID_OUT"}>Pago</MenuItem>
                      <MenuItem value={"WAITING"}>Não Pago</MenuItem>
                      <MenuItem value={"REFUSED"}>Não Autorizado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <Button
                    fullWidth
                    size="large"
                    startIcon={<AiOutlineSave />}
                    variant="contained"
                    onClick={saveMovement}
                    loading={isLoading}
                  >
                    Salvar
                  </Button>
                </Grid>
              </Grid>
            </DefaultContainer>
          </Box>
        </Box>
      </Container>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Fragment>
  );
}
