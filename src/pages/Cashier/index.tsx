import { Fragment, useEffect, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import subDays from "date-fns/subDays";
import {
  Chip,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ptBr from "date-fns/locale/pt-BR";
import differenceInDays from "date-fns/differenceInDays";
import Button from "../../components/layout/Button";
import {
  AiOutlineLineChart,
  AiOutlinePlus,
  AiOutlineSearch,
} from "react-icons/ai";
import IconButton from "../../components/layout/IconButton";
import { BsDoorOpen } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { CashierEntity } from "../../services/entities/cashiers";
import EmptyBox from "../../components/layout/EmptyBox";
import Loading from "../../components/layout/Loading";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import formatCurrency from "../../helpers/formatCurrency";

export default function Cashier() {
  const navigate = useNavigate();

  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [cashiers, setCashiers] = useState<CashierEntity[]>([]);

  function getCashiers() {
    setIsLoading(true);
    api
      .post("/cashier/list", {
        endDate,
        startDate,
      })
      .then((response) => {
        setIsLoading(false);
        setCashiers(response.data);
      })
      .catch((error) => {
        getErrorMessage({ error });
        setIsLoading(false);
      });
  }

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
  }

  useEffect(() => {
    getCashiers();
  }, []);

  return (
    <Fragment>
      <AppBar title="Gestão de Caixa" />
      <Container>
        <Stack p={2} spacing={2}>
          <DefaultContainer disabledPadding>
            <Grid container spacing={2} alignItems={"center"}>
              <Grid item xs={12} sm={6} md={5}>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={ptBr}
                >
                  <DatePicker
                    label="Data inicial"
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
              <Grid item xs={12} sm={6} md={5}>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={ptBr}
                >
                  <DatePicker
                    label="Data final"
                    slotProps={{
                      textField: {
                        variant: "filled",
                        fullWidth: true,
                        size: "small",
                      },
                    }}
                    value={endDate}
                    onChange={(e) => setEndDate(e as Date)}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AiOutlineSearch />}
                  size="large"
                >
                  Buscar
                </Button>
              </Grid>
            </Grid>
          </DefaultContainer>

          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            flexWrap={"wrap"}
            gap={2}
          >
            <Button
              variant="contained"
              startIcon={<AiOutlinePlus />}
              onClick={() => navigate("/dashboard/caixa/novo")}
            >
              Abrir novo
            </Button>
            <Typography variant="body2" fontWeight={"600"} color={"GrayText"}>
              Resultados dos últimos {differenceInDays(endDate, startDate)} dias
            </Typography>
          </Stack>

          <DefaultContainer disabledPadding>
            {isLoading ? (
              <Loading />
            ) : (
              <>
                {cashiers.length === 0 ? (
                  <EmptyBox label="Nenhuma informação encontrada" />
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ minWidth: "150px" }}>
                            Data de Abertura
                          </TableCell>
                          <TableCell
                            sx={{
                              textAlign: "right",
                              minWidth: "160px",
                            }}
                          >
                            Valor de Abertura
                          </TableCell>
                          <TableCell sx={{ minWidth: "170px" }}>
                            Data de Fechamento
                          </TableCell>
                          <TableCell
                            sx={{
                              textAlign: "right",
                              minWidth: "170px",
                            }}
                          >
                            Valor de Fechamento
                          </TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell
                            sx={{ textAlign: "center", width: "60px" }}
                          >
                            Ações
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cashiers.map((cashier) => (
                          <TableRow hover key={cashier.id}>
                            <TableCell>
                              {formatDate(cashier.open_date)}
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "right",
                              }}
                            >
                              {formatCurrency(cashier.open_value)}
                            </TableCell>
                            <TableCell>
                              {!cashier.close_date
                                ? "-"
                                : formatDate(cashier.close_date)}
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "right",
                              }}
                            >
                              {!cashier.close_value
                                ? "-"
                                : formatCurrency(cashier.close_value)}
                            </TableCell>
                            <TableCell>
                              <Chip
                                variant="outlined"
                                size="small"
                                label={
                                  cashier.status === "OPENED"
                                    ? "Aberto"
                                    : "Fechado"
                                }
                                color={
                                  cashier.status === "OPENED"
                                    ? "success"
                                    : "error"
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Stack
                                spacing={1}
                                direction={"row"}
                                justifyContent={"center"}
                              >
                                {cashier.status === "OPENED" ? (
                                  <Tooltip title="Ir para o caixa" arrow>
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() =>
                                        navigate(
                                          `/dashboard/caixa/${cashier.id}`
                                        )
                                      }
                                    >
                                      <BsDoorOpen />
                                    </IconButton>
                                  </Tooltip>
                                ) : (
                                  <Tooltip title="Movimentação" arrow>
                                    <IconButton size="small" color="primary">
                                      <AiOutlineLineChart />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )}
          </DefaultContainer>
        </Stack>
      </Container>
    </Fragment>
  );
}
