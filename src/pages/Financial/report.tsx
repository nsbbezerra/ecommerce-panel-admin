import { Fragment, useEffect, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import {
  Box,
  Grid,
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
import { MdSsidChart } from "react-icons/md";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ptBr from "date-fns/locale/pt-BR";
import Button from "../../components/layout/Button";
import { AiOutlinePrinter, AiOutlineSearch } from "react-icons/ai";
import { green, grey, red } from "@mui/material/colors";
import { api, apiUrl } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import { FinancialMovimentsEntity } from "../../services/entities/financial-moviments";
import { PaymentsEntity } from "../../services/entities/payments";
import Loading from "../../components/layout/Loading";
import formatCurrency from "../../helpers/formatCurrency";
import handlePayForm from "../../helpers/handlePayForm";

interface Orders {
  id: string;
  code: string;
  shipping_value: string;
  total: string;
  sub_total: string;
  discount: string;
  order_status: string;
  payment_status: string;
  mode: string;
  checkout_id: string | null;
  payment_id: string | null;
  shipping_id: string | null;
  shipping_code: string | null;
  shipping_tracking_url: string | null;
  payment_mode: string | null;
  order_from: string;
  installments: number | null;
  pay_form: string | null;
  created_at: Date;
  client_id: string;
  month: string;
  year: string;
  cashier_id: string | null;
}

export default function AppReport() {
  const navigate = useNavigate();

  const [periodDate, setPeriodDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [revenues, setRevenues] = useState<FinancialMovimentsEntity[]>([]);
  const [expenses, setExpenses] = useState<FinancialMovimentsEntity[]>([]);
  const [orders, setOrders] = useState<Orders[]>([]);
  const [payments, setPayments] = useState<PaymentsEntity[]>([]);

  function generateReport() {
    setIsLoading(true);
    const month = new Intl.DateTimeFormat("pt-Br", { month: "long" }).format(
      periodDate
    );
    const year = periodDate.getFullYear().toString();
    api
      .get(`/report/generate/${month}/${year}`)
      .then((response) => {
        setRevenues(response.data.revenues);
        setExpenses(response.data.expenses);
        setOrders(response.data.checkoutSales);
        setPayments(response.data.salesPayments);
        setIsLoading(false);
      })
      .catch((error) => {
        getErrorMessage({ error });
        setIsLoading(false);
      });
  }

  function calcRevenues(): number {
    const ordersTotal = orders.reduce(
      (partialSum, a) => partialSum + parseFloat(a.sub_total),
      0
    );
    const paymentsTotal = payments.reduce(
      (partialSum, a) => partialSum + parseFloat(a.total),
      0
    );
    const revenuesTotal = revenues.reduce(
      (partialSum, a) => partialSum + parseFloat(a.value),
      0
    );

    return ordersTotal + paymentsTotal + revenuesTotal;
  }

  function calcExpenses(): number {
    return expenses.reduce(
      (partialSum, a) => partialSum + parseFloat(a.value),
      0
    );
  }

  function printReport() {
    const month = new Intl.DateTimeFormat("pt-Br", { month: "long" }).format(
      periodDate
    );
    const year = periodDate.getFullYear().toString();
    window.open(`${apiUrl}/report/print/${month}/${year}`, "_blank");
  }

  useEffect(() => {
    generateReport();
  }, []);

  return (
    <Fragment>
      <AppBar title="Relatório Financeiro" />

      <Container size="lg">
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
              active={false}
              onClick={() => navigate("/dashboard/financeiro/pagamentos")}
            >
              <GiReceiveMoney className="menu-icon" />
              <div className="menu-right">
                <span className="menu-title">GESTÃO</span>
                <span className="menu-desc">DE PAGAMENTOS</span>
              </div>
            </MenuItem>
            <MenuItem
              active={true}
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
              <Box>
                <Grid container spacing={2} alignItems={"center"}>
                  <Grid item xs={12} sm={7} md={9}>
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
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={5} md={3}>
                    <Button
                      fullWidth
                      size="large"
                      startIcon={<AiOutlineSearch />}
                      variant="contained"
                      onClick={generateReport}
                    >
                      Buscar
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </DefaultContainer>
          </Box>

          {isLoading ? (
            <DefaultContainer disabledPadding>
              <Loading />
            </DefaultContainer>
          ) : (
            <>
              <Stack direction={"row"} mt={2}>
                <Button
                  variant="contained"
                  startIcon={<AiOutlinePrinter />}
                  onClick={printReport}
                >
                  Imprimir Relatório
                </Button>
              </Stack>

              <Box
                borderRadius={"4px"}
                boxShadow={"0px 0px 9px rgba(0, 0, 0, 0.05)"}
                bgcolor={"#FFF"}
                overflow={"hidden"}
                mt={2}
              >
                <Stack
                  direction={"row"}
                  spacing={2}
                  alignItems={"center"}
                  bgcolor={green["100"]}
                  color={green["700"]}
                  px={2}
                  py={1}
                >
                  <GiReceiveMoney />
                  <Typography fontWeight={"600"}>RECEITAS</Typography>
                </Stack>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Descrição</TableCell>
                        <TableCell
                          sx={{
                            minWidth: "140px",
                            maxWidth: "140px",
                            textAlign: "right",
                          }}
                        >
                          Valor
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {revenues.map((rev) => (
                        <TableRow hover key={rev.id}>
                          <TableCell>{rev.title}</TableCell>
                          <TableCell sx={{ textAlign: "right" }}>
                            {formatCurrency(rev.value)}
                          </TableCell>
                        </TableRow>
                      ))}
                      {orders.map((ord) => (
                        <TableRow hover key={ord.id}>
                          <TableCell>
                            Venda de produtos checkout online nº: {ord.code}
                          </TableCell>
                          <TableCell sx={{ textAlign: "right" }}>
                            {formatCurrency(ord.sub_total)}
                          </TableCell>
                        </TableRow>
                      ))}
                      {payments.map((pay) => (
                        <TableRow hover key={pay.id}>
                          <TableCell>
                            Recebimento de vendas de produtos:{" "}
                            {handlePayForm(pay.pay_form)}
                          </TableCell>
                          <TableCell sx={{ textAlign: "right" }}>
                            {formatCurrency(pay.total)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  px={2}
                  py={0.5}
                  bgcolor={grey["300"]}
                >
                  <Typography fontWeight={500}>TOTAL</Typography>
                  <Typography fontWeight={500}>
                    {formatCurrency(calcRevenues())}
                  </Typography>
                </Stack>
              </Box>

              <Box
                borderRadius={"4px"}
                boxShadow={"0px 0px 9px rgba(0, 0, 0, 0.05)"}
                bgcolor={"#FFF"}
                overflow={"hidden"}
                mt={2}
              >
                <Stack
                  direction={"row"}
                  spacing={2}
                  alignItems={"center"}
                  bgcolor={red["100"]}
                  color={red["700"]}
                  px={2}
                  py={1}
                >
                  <GiPayMoney />
                  <Typography fontWeight={"600"}>DESPESAS</Typography>
                </Stack>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Descrição</TableCell>
                        <TableCell
                          sx={{
                            minWidth: "140px",
                            maxWidth: "140px",
                            textAlign: "right",
                          }}
                        >
                          Valor
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {expenses.map((exp) => (
                        <TableRow hover key={exp.id}>
                          <TableCell>{exp.title}</TableCell>
                          <TableCell sx={{ textAlign: "right" }}>
                            {formatCurrency(exp.value)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  px={2}
                  py={0.5}
                  bgcolor={grey["300"]}
                >
                  <Typography fontWeight={500}>TOTAL</Typography>
                  <Typography fontWeight={500}>
                    {formatCurrency(calcExpenses())}
                  </Typography>
                </Stack>
              </Box>

              <Box
                borderRadius={"4px"}
                boxShadow={"0px 0px 9px rgba(0, 0, 0, 0.05)"}
                bgcolor={"#FFF"}
                overflow={"hidden"}
                mt={2}
              >
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  px={2}
                  py={1}
                >
                  <Typography>TOTAL DAS DESPESAS</Typography>
                  <Typography>{formatCurrency(calcExpenses())}</Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  px={2}
                  py={1}
                >
                  <Typography>TOTAL DAS RECEITAS</Typography>
                  <Typography>{formatCurrency(calcRevenues())}</Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  px={2}
                  py={1}
                  bgcolor={
                    Number(calcRevenues() - calcExpenses()) < 0
                      ? red["100"]
                      : green["100"]
                  }
                  color={
                    Number(calcRevenues() - calcExpenses()) < 0
                      ? red["800"]
                      : green["800"]
                  }
                >
                  <Typography fontWeight={500} fontSize={20}>
                    SALDO TOTAL
                  </Typography>
                  <Typography fontWeight={500} fontSize={20}>
                    {formatCurrency(calcRevenues() - calcExpenses())}
                  </Typography>
                </Stack>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Fragment>
  );
}
