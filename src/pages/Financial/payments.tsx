import { Fragment, useEffect, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import {
  Box,
  Chip,
  FormControl,
  Grid,
  Icon,
  InputLabel,
  MenuItem as MUIMenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { MenuContainer, MenuItem } from "../Pdv/styles";
import { useNavigate } from "react-router-dom";
import { MdSsidChart } from "react-icons/md";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import DefaultContainer from "../../components/layout/DefaultContainer";
import subDays from "date-fns/subDays";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ptBr from "date-fns/locale/pt-BR";
import Button from "../../components/layout/Button";
import {
  AiFillLock,
  AiOutlineClear,
  AiOutlineEdit,
  AiOutlineSearch,
} from "react-icons/ai";
import IconButton from "../../components/layout/IconButton";
import { blue, green, grey, red } from "@mui/material/colors";
import InputText from "../../components/layout/InputText";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import { PaymentsWithRelatioshipEntity } from "../../services/entities/payments";
import Loading from "../../components/layout/Loading";
import EmptyBox from "../../components/layout/EmptyBox";
import formatCurrency from "../../helpers/formatCurrency";
import handlePaymentStatus from "../../helpers/hanldePaymentStatus";
import Swal from "sweetalert2";

export default function PaymentsManager() {
  const navigate = useNavigate();

  const [endDate, setEndDate] = useState<Date>(new Date());
  const [periodDate, setPeriodDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [clientName, setClientName] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("ALL");

  const [backdrop, setBackdrop] = useState<boolean>(false);

  const [typeSearch, setTypeSearch] = useState<string>("MONTH");

  const [payments, setPayments] = useState<PaymentsWithRelatioshipEntity[]>([]);

  function clear() {
    setEndDate(new Date());
    setStartDate(subDays(new Date(), 30));
    setPeriodDate(new Date());
    setTypeSearch("MONTH");
    setPaymentStatus("ALL");
    setClientName("");
  }

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
  }

  function getPayments() {
    if (typeSearch === "ALL" && !clientName.length) {
      Swal.fire({
        title: "Atenção",
        text: "Para esse tipo de busca você tem que inserir o nome do cliente.",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    const status =
      paymentStatus === "ALL"
        ? ["PAID_OUT", "WAITING", "REFUSED"]
        : [paymentStatus];
    setBackdrop(true);
    api
      .post("/payments/find", {
        type: typeSearch,
        endDate,
        startDate,
        month: new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
          periodDate
        ),
        year: startDate.getFullYear().toString(),
        payment_status: status,
        name: clientName,
      })
      .then((response) => {
        setPayments(response.data);
        setBackdrop(false);
      })
      .catch((error) => {
        getErrorMessage({ error });
        setBackdrop(false);
      });
  }

  function sumValues(mode: "REFUSED" | "PAID_OUT" | "WAITING"): number {
    if (mode === "WAITING") {
      return payments
        .filter(
          (obj) => obj.status === mode && new Date(obj.due_date) < new Date()
        )
        .reduce((partialSum, a) => partialSum + parseFloat(a.total), 0);
    } else {
      return payments
        .filter((obj) => obj.status === mode)
        .reduce((partialSum, a) => partialSum + parseFloat(a.total), 0);
    }
  }

  useEffect(() => {
    getPayments();
  }, []);

  return (
    <Fragment>
      <AppBar title="Gestão de Pagamentos" />

      <Container>
        <Box p={2}>
          <MenuContainer>
            <MenuItem
              active={false}
              onClick={() => navigate("/dashboard/financeiro/movimentos")}
            >
              <MdSsidChart className="menu-icon" />
              <div className="menu-right">
                <span className="menu-title">GESTÃO DAS</span>
                <span className="menu-desc">MOVIMENTAÇÕES</span>
              </div>
            </MenuItem>
            <MenuItem
              active={true}
              onClick={() => navigate("/dashboard/financeiro/pagamentos")}
            >
              <GiReceiveMoney className="menu-icon" />
              <div className="menu-right">
                <span className="menu-title">GESTÃO</span>
                <span className="menu-desc">DE PAGAMENTOS</span>
              </div>
            </MenuItem>
            <MenuItem
              active={false}
              onClick={() => navigate("/dashboard/financeiro/relatorio")}
            >
              <BsFileEarmarkBarGraph className="menu-icon" />
              <div className="menu-right">
                <span className="menu-title">RELATÓRIO</span>
                <span className="menu-desc">FINANCEIRO</span>
              </div>
            </MenuItem>
          </MenuContainer>

          <Box mt={2}>
            <DefaultContainer disabledPadding>
              <Grid
                container
                spacing={2}
                alignItems={"center"}
                justifyContent={"end"}
              >
                <Grid item xs={12} sm={6} lg={3}>
                  <FormControl variant="filled" fullWidth size="small">
                    <InputLabel id="select-type-search">
                      Tipo de Busca
                    </InputLabel>
                    <Select
                      labelId="select-type-search"
                      id="select-type-search"
                      value={typeSearch}
                      onChange={(e) => setTypeSearch(e.target.value)}
                    >
                      <MUIMenuItem value="">
                        <em>Selecione</em>
                      </MUIMenuItem>
                      <MUIMenuItem value={"ALL"}>Todos</MUIMenuItem>
                      <MUIMenuItem value={"MONTH"}>Por Mês</MUIMenuItem>
                      <MUIMenuItem value={"PERIOD"}>Por Período</MUIMenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={ptBr}
                  >
                    <DatePicker
                      label="Mês e Ano"
                      slotProps={{
                        textField: {
                          variant: "filled",
                          fullWidth: true,
                          size: "small",
                        },
                      }}
                      value={periodDate}
                      onChange={(e) => setPeriodDate(e as Date)}
                      views={["month", "year"]}
                      disabled={typeSearch !== "MONTH"}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
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
                      disabled={typeSearch !== "PERIOD"}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
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
                      disabled={typeSearch !== "PERIOD"}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                  <FormControl variant="filled" fullWidth size="small">
                    <InputLabel id="select-type-status">
                      Status do Pagamento
                    </InputLabel>
                    <Select
                      labelId="select-type-status"
                      id="select-type-status"
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                      <MUIMenuItem value="">
                        <em>Selecione</em>
                      </MUIMenuItem>
                      <MUIMenuItem value={"ALL"}>Todos</MUIMenuItem>
                      <MUIMenuItem value={"PAID_OUT"}>Pagos</MUIMenuItem>
                      <MUIMenuItem value={"WAITING"}>Não Pago</MUIMenuItem>
                      <MUIMenuItem value={"REFUSED"}>Recusado</MUIMenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                  <InputText
                    label="Digite o nome do cliente"
                    fullWidth
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                  <Button
                    startIcon={<AiOutlineClear />}
                    size="large"
                    variant="contained"
                    fullWidth
                    color="error"
                    onClick={clear}
                  >
                    Limpar
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                  <Button
                    startIcon={<AiOutlineSearch />}
                    size="large"
                    variant="contained"
                    fullWidth
                    onClick={() => getPayments()}
                  >
                    Buscar
                  </Button>
                </Grid>
              </Grid>
            </DefaultContainer>
          </Box>

          <Box mt={2}>
            <Grid spacing={2} container>
              <Grid item xs={12} md={4}>
                <Box
                  bgcolor={green["700"]}
                  sx={{
                    boxShadow: "0px 0px 9px rgba(0, 0, 0, 0.05)",
                    borderRadius: "4px",
                  }}
                  px={2}
                  py={1}
                  color={"#fff"}
                >
                  <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <GiReceiveMoney
                      fontSize={"50px"}
                      style={{ flexShrink: 0 }}
                    />
                    <Box>
                      <Typography
                        variant="h5"
                        fontWeight={600}
                        lineHeight={"40px"}
                      >
                        {formatCurrency(sumValues("PAID_OUT"))}
                      </Typography>
                      <Typography variant="body2">Total Recebido</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box
                  bgcolor={red["700"]}
                  sx={{
                    boxShadow: "0px 0px 9px rgba(0, 0, 0, 0.05)",
                    borderRadius: "4px",
                  }}
                  px={2}
                  py={1}
                  color={"#fff"}
                >
                  <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <GiPayMoney fontSize={"50px"} style={{ flexShrink: 0 }} />
                    <Box>
                      <Typography
                        variant="h5"
                        fontWeight={600}
                        lineHeight={"40px"}
                      >
                        {formatCurrency(sumValues("WAITING"))}
                      </Typography>
                      <Typography variant="body2">Total Devido</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box
                  bgcolor={grey["900"]}
                  sx={{
                    boxShadow: "0px 0px 9px rgba(0, 0, 0, 0.05)",
                    borderRadius: "4px",
                  }}
                  px={2}
                  py={1}
                  color={"#fff"}
                >
                  <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <AiFillLock fontSize={"50px"} style={{ flexShrink: 0 }} />
                    <Box>
                      <Typography
                        variant="h5"
                        fontWeight={600}
                        lineHeight={"40px"}
                      >
                        {formatCurrency(sumValues("REFUSED"))}
                      </Typography>
                      <Typography variant="body2">Total Recusado</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box mt={2}>
            <DefaultContainer disabledPadding disablePaddingInside>
              {backdrop ? (
                <Loading />
              ) : (
                <>
                  {payments.length === 0 ? (
                    <EmptyBox label="Nenhuma informação encontrada" />
                  ) : (
                    <TableContainer sx={{ py: 1 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Compra Nº</TableCell>
                            <TableCell sx={{ minWidth: "240px" }}>
                              Cliente
                            </TableCell>
                            <TableCell sx={{ minWidth: "190px" }}>
                              Status do Pagamento
                            </TableCell>
                            <TableCell sx={{ minWidth: "180px" }}>
                              Data de Vencimento
                            </TableCell>
                            <TableCell
                              sx={{ minWidth: "150px", textAlign: "right" }}
                            >
                              Valor
                            </TableCell>
                            <TableCell
                              sx={{ width: "5px", textAlign: "center" }}
                            >
                              Ações
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {payments.map((payment) => (
                            <TableRow
                              hover
                              key={payment.id}
                              sx={{
                                background:
                                  new Date(payment.due_date) < new Date() &&
                                  payment.status !== "PAID_OUT"
                                    ? red["100"]
                                    : "",
                              }}
                            >
                              <TableCell>{payment.order.code || ""}</TableCell>
                              <TableCell>
                                {payment.order.client.name || ""}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={
                                    handlePaymentStatus(payment.status).label
                                  }
                                  size="small"
                                  color={
                                    handlePaymentStatus(payment.status).color
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                {formatDate(payment.due_date)}
                              </TableCell>
                              <TableCell sx={{ textAlign: "right" }}>
                                {formatCurrency(payment.total)}
                              </TableCell>
                              <TableCell>
                                <Stack
                                  direction={"row"}
                                  spacing={1}
                                  justifyContent={"center"}
                                >
                                  <IconButton size="small" color="primary">
                                    <AiOutlineEdit />
                                  </IconButton>
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
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
}
