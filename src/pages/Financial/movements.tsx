import { Fragment, useEffect, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import {
  MenuItem as MUIMenuItem,
  FormControl,
  Grid,
  InputLabel,
  Select,
  Stack,
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Backdrop,
  CircularProgress,
  Collapse,
  Chip,
} from "@mui/material";
import { MenuContainer, MenuItem } from "../Pdv/styles";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { MdSsidChart } from "react-icons/md";
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import DefaultContainer from "../../components/layout/DefaultContainer";
import subDays from "date-fns/subDays";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ptBr from "date-fns/locale/pt-BR";
import Button from "../../components/layout/Button";
import {
  AiOutlineClear,
  AiOutlineEdit,
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineSearch,
} from "react-icons/ai";
import { blue, green, grey, red } from "@mui/material/colors";
import IconButton from "../../components/layout/IconButton";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import { FinancialMovimentsEntity } from "../../services/entities/financial-moviments";
import formatCurrency from "../../helpers/formatCurrency";
import EmptyBox from "../../components/layout/EmptyBox";
import handlePaymentStatus from "../../helpers/hanldePaymentStatus";
import { FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import getSuccessMessage from "../../helpers/getMessageSuccess";

interface MovimentSum {
  _sum: { value: string };
  mode: "REVENUE" | "EXPENSE";
}

interface CollapesdProps {
  id: string;
  open: boolean;
}

export default function FinancialMovements() {
  const navigate = useNavigate();

  const [endDate, setEndDate] = useState<Date>(new Date());
  const [periodDate, setPeriodDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));

  const [backdrop, setBackdrop] = useState<boolean>(false);

  const [typeSearch, setTypeSearch] = useState<string>("MONTH");

  const [expenses, setExpenses] = useState<FinancialMovimentsEntity[]>([]);
  const [revenues, setRevenues] = useState<FinancialMovimentsEntity[]>([]);
  const [movimentSum, setMovimentSum] = useState<MovimentSum[]>([]);

  const [revenuesCollapes, setRevenuesCollapse] = useState<CollapesdProps>({
    id: "",
    open: false,
  });
  const [expensesCollapes, setExpensesCollapse] = useState<CollapesdProps>({
    id: "",
    open: false,
  });

  function clear() {
    setEndDate(new Date());
    setStartDate(subDays(new Date(), 30));
    setPeriodDate(new Date());
    setTypeSearch("MONTH");
  }

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
  }

  function findMovements() {
    setBackdrop(true);
    api
      .post("/financial-movements/find-by-search", {
        type: typeSearch,
        endDate,
        startDate,
        month: new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
          periodDate
        ),
        year: startDate.getFullYear().toString(),
      })
      .then((response) => {
        setBackdrop(false);
        setExpenses(response.data.expenses);
        setRevenues(response.data.revenues);
        setMovimentSum(response.data.movementSum);
      })
      .catch((error) => {
        setBackdrop(false);
        getErrorMessage({ error });
      });
  }

  function calcSummary() {
    const revenueValue = parseFloat(
      movimentSum.find((obj) => obj.mode === "REVENUE")?._sum.value || "0"
    );
    const expenseValue = parseFloat(
      movimentSum.find((obj) => obj.mode === "EXPENSE")?._sum.value || "0"
    );
    const totalValue = revenueValue - expenseValue;

    return { revenueValue, expenseValue, totalValue };
  }

  function deleteMoviment(id: string) {
    Swal.fire({
      title: "Confirmação",
      text: "Deseja deletar este movimento?",
      icon: "question",
      showDenyButton: true,
      denyButtonText: "Não",
      confirmButtonText: "Sim",
      denyButtonColor: red["600"],
      confirmButtonColor: blue["500"],
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return api
          .delete(`/financial-movements/delete/${id}`)
          .then((response) => {
            return response.data;
          })
          .catch((error) => getErrorMessage({ error }));
      },
    }).then((results) => {
      if (results.isConfirmed) {
        getSuccessMessage({ message: results.value.message });
        findMovements();
      }
    });
  }

  useEffect(() => {
    findMovements();
  }, []);

  return (
    <Fragment>
      <AppBar title="Movimentações Financeiras" />

      <Container>
        <Box p={2}>
          <MenuContainer>
            <MenuItem
              active={true}
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
                <Grid item xs={12} sm={6} lg={2}>
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
                      <MUIMenuItem value={"MONTH"}>Por Mês</MUIMenuItem>
                      <MUIMenuItem value={"PERIOD"}>Por Período</MUIMenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} lg={2}>
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

                <Grid item xs={12} sm={6} lg={2}>
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

                <Grid item xs={12} sm={6} lg={2}>
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

                <Grid item xs={12} sm={6} lg={2}>
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

                <Grid item xs={12} sm={6} lg={2}>
                  <Button
                    startIcon={<AiOutlineSearch />}
                    size="large"
                    variant="contained"
                    fullWidth
                    onClick={findMovements}
                  >
                    Buscar
                  </Button>
                </Grid>
              </Grid>
            </DefaultContainer>
          </Box>

          <Stack
            mt={2}
            gap={2}
            direction={"row"}
            justifyContent={"space-between"}
            flexWrap={"wrap"}
          >
            <Button
              variant="contained"
              startIcon={<AiOutlinePlus />}
              style={{ minWidth: "179px" }}
              fullWidth={false}
              onClick={() => navigate("/dashboard/financeiro/movimentos/criar")}
            >
              ADICIONAR NOVO
            </Button>

            <Box
              sx={{ boxShadow: "0px 0px 9px rgba(0, 0, 0, 0.05)" }}
              bgcolor={
                calcSummary().totalValue === 0
                  ? grey["400"]
                  : calcSummary().totalValue > 0
                  ? green["100"]
                  : red["100"]
              }
              borderRadius={"4px"}
              px={2}
              py={1}
              color={
                calcSummary().totalValue === 0
                  ? grey["800"]
                  : calcSummary().totalValue > 0
                  ? green["700"]
                  : red["700"]
              }
              flex={1}
            >
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                spacing={2}
              >
                <Typography fontWeight={600} variant="h6">
                  Saldo
                </Typography>
                <Typography fontWeight={600} variant="h6">
                  {formatCurrency(calcSummary().totalValue)}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
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
                        {formatCurrency(
                          movimentSum.find((obj) => obj.mode === "REVENUE")
                            ?._sum.value || 0
                        )}
                      </Typography>
                      <Typography variant="body2">
                        Total das Receitas
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box mt={2}>
                  <DefaultContainer disabledPadding>
                    {revenues.length === 0 ? (
                      <EmptyBox label="Nenhuma informação encontrada" />
                    ) : (
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Título</TableCell>
                              <TableCell sx={{ textAlign: "right" }}>
                                Valor
                              </TableCell>
                              <TableCell>Vencimento</TableCell>
                              <TableCell
                                sx={{
                                  maxWidth: "5px",
                                  minWidth: "5px",
                                  width: "5px",
                                }}
                              ></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {revenues.map((rev) => (
                              <>
                                <TableRow
                                  hover
                                  key={rev.id}
                                  sx={{
                                    "& > *": { borderBottom: "0" },
                                    background:
                                      new Date(rev.due_date) < new Date() &&
                                      rev.payment_status !== "PAID_OUT"
                                        ? red["100"]
                                        : "",
                                  }}
                                >
                                  <TableCell sx={{ borderBottom: 0 }}>
                                    {rev.title}
                                  </TableCell>
                                  <TableCell
                                    sx={{ textAlign: "right", borderBottom: 0 }}
                                  >
                                    {formatCurrency(rev.value)}
                                  </TableCell>
                                  <TableCell sx={{ borderBottom: 0 }}>
                                    {formatDate(rev.due_date)}
                                  </TableCell>
                                  <TableCell sx={{ borderBottom: 0 }}>
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() =>
                                        setRevenuesCollapse({
                                          id: rev.id,
                                          open:
                                            revenuesCollapes.id === rev.id &&
                                            revenuesCollapes.open === true
                                              ? false
                                              : true,
                                        })
                                      }
                                    >
                                      {revenuesCollapes.id === rev.id &&
                                      revenuesCollapes.open ? (
                                        <AiOutlineMinus />
                                      ) : (
                                        <AiOutlinePlus />
                                      )}
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell
                                    colSpan={4}
                                    style={{
                                      paddingBottom: 0,
                                      paddingTop: 0,
                                      paddingLeft: 0,
                                      paddingRight: 0,
                                    }}
                                  >
                                    <Collapse
                                      in={
                                        revenuesCollapes.open &&
                                        revenuesCollapes.id === rev.id
                                      }
                                    >
                                      <Box
                                        p={1}
                                        my={1}
                                        bgcolor={grey["100"]}
                                        borderRadius={"4px"}
                                      >
                                        <Box
                                          bgcolor={"#FFF"}
                                          borderRadius={"4px"}
                                          overflow={"hidden"}
                                        >
                                          <Stack
                                            direction={"row"}
                                            spacing={2}
                                            alignItems={"center"}
                                            bgcolor={blue["100"]}
                                            color={blue["700"]}
                                            px={2}
                                            py={1}
                                          >
                                            <GiReceiveMoney />
                                            <Typography
                                              variant="body2"
                                              fontWeight={"600"}
                                            >
                                              DADOS DA RECEITA
                                            </Typography>
                                          </Stack>

                                          <Stack spacing={1} p={1}>
                                            <Stack spacing={0}>
                                              <Typography
                                                color={grey["600"]}
                                                variant="body1"
                                              >
                                                Título da Receita
                                              </Typography>
                                              <Typography fontWeight={"500"}>
                                                {rev.title}
                                              </Typography>
                                            </Stack>

                                            <Stack spacing={0}>
                                              <Typography
                                                color={grey["600"]}
                                                variant="body1"
                                              >
                                                Descrição da Receita
                                              </Typography>
                                              <Typography fontWeight={"500"}>
                                                {rev.description}
                                              </Typography>
                                            </Stack>

                                            <Grid container spacing={0}>
                                              <Grid item xs={6}>
                                                <Stack spacing={0}>
                                                  <Typography
                                                    color={grey["600"]}
                                                    variant="body1"
                                                  >
                                                    Valor da Receita
                                                  </Typography>
                                                  <Typography
                                                    fontWeight={"500"}
                                                  >
                                                    {formatCurrency(rev.value)}
                                                  </Typography>
                                                </Stack>
                                              </Grid>

                                              <Grid item xs={6}>
                                                <Stack spacing={0}>
                                                  <Typography
                                                    color={grey["600"]}
                                                    variant="body1"
                                                  >
                                                    Data de Vencimento
                                                  </Typography>
                                                  <Typography
                                                    fontWeight={"500"}
                                                  >
                                                    {formatDate(rev.due_date)}
                                                  </Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>

                                            <Grid
                                              container
                                              spacing={0}
                                              alignItems={"center"}
                                            >
                                              <Grid item xs={6}>
                                                <Stack spacing={0}>
                                                  <Typography
                                                    color={grey["600"]}
                                                    variant="body1"
                                                  >
                                                    Status do Pagamento
                                                  </Typography>
                                                  <Chip
                                                    label={
                                                      handlePaymentStatus(
                                                        rev.payment_status
                                                      ).label
                                                    }
                                                    color={
                                                      handlePaymentStatus(
                                                        rev.payment_status
                                                      ).color
                                                    }
                                                    sx={{
                                                      width: "fit-content",
                                                    }}
                                                  />
                                                </Stack>
                                              </Grid>

                                              <Grid item xs={6}>
                                                <Stack
                                                  direction={"row"}
                                                  gap={1}
                                                >
                                                  <Button
                                                    startIcon={<FiTrash2 />}
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() =>
                                                      deleteMoviment(rev.id)
                                                    }
                                                    fullWidth
                                                  >
                                                    Excluir
                                                  </Button>

                                                  <Button
                                                    startIcon={
                                                      <AiOutlineEdit />
                                                    }
                                                    variant="contained"
                                                    onClick={() =>
                                                      navigate(
                                                        `/dashboard/financeiro/movimentos/editar/${rev.id}`
                                                      )
                                                    }
                                                    fullWidth
                                                  >
                                                    Editar
                                                  </Button>
                                                </Stack>
                                              </Grid>
                                            </Grid>
                                          </Stack>
                                        </Box>
                                      </Box>
                                    </Collapse>
                                  </TableCell>
                                </TableRow>
                              </>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </DefaultContainer>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
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
                        {formatCurrency(
                          movimentSum.find((obj) => obj.mode === "EXPENSE")
                            ?._sum.value || 0
                        )}
                      </Typography>
                      <Typography variant="body2">
                        Total das Despesas
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box mt={2}>
                  <DefaultContainer disabledPadding>
                    {expenses.length === 0 ? (
                      <EmptyBox label="Nenhuma informação encontrada" />
                    ) : (
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Título</TableCell>
                              <TableCell sx={{ textAlign: "right" }}>
                                Valor
                              </TableCell>
                              <TableCell>Vencimento</TableCell>
                              <TableCell
                                sx={{
                                  maxWidth: "5px",
                                  minWidth: "5px",
                                  width: "5px",
                                }}
                              ></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {expenses.map((exp) => (
                              <>
                                <TableRow
                                  hover
                                  key={exp.id}
                                  sx={{
                                    "& > *": { borderBottom: "0" },
                                    background:
                                      new Date(exp.due_date) < new Date() &&
                                      exp.payment_status !== "PAID_OUT"
                                        ? red["100"]
                                        : "",
                                  }}
                                >
                                  <TableCell sx={{ borderBottom: 0 }}>
                                    {exp.title}
                                  </TableCell>
                                  <TableCell
                                    sx={{ textAlign: "right", borderBottom: 0 }}
                                  >
                                    {formatCurrency(exp.value)}
                                  </TableCell>
                                  <TableCell sx={{ borderBottom: 0 }}>
                                    {formatDate(exp.due_date)}
                                  </TableCell>
                                  <TableCell sx={{ borderBottom: 0 }}>
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() =>
                                        setExpensesCollapse({
                                          id: exp.id,
                                          open:
                                            expensesCollapes.id === exp.id &&
                                            expensesCollapes.open === true
                                              ? false
                                              : true,
                                        })
                                      }
                                    >
                                      {expensesCollapes.id === exp.id &&
                                      expensesCollapes.open ? (
                                        <AiOutlineMinus />
                                      ) : (
                                        <AiOutlinePlus />
                                      )}
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell
                                    colSpan={4}
                                    style={{
                                      paddingBottom: 0,
                                      paddingTop: 0,
                                      paddingLeft: 0,
                                      paddingRight: 0,
                                    }}
                                  >
                                    <Collapse
                                      in={
                                        expensesCollapes.open &&
                                        expensesCollapes.id === exp.id
                                      }
                                    >
                                      <Box
                                        p={1}
                                        my={1}
                                        bgcolor={grey["100"]}
                                        borderRadius={"4px"}
                                      >
                                        <Box
                                          bgcolor={"#FFF"}
                                          borderRadius={"4px"}
                                          overflow={"hidden"}
                                        >
                                          <Stack
                                            direction={"row"}
                                            spacing={2}
                                            alignItems={"center"}
                                            bgcolor={blue["100"]}
                                            color={blue["700"]}
                                            px={2}
                                            py={1}
                                          >
                                            <GiReceiveMoney />
                                            <Typography
                                              variant="body2"
                                              fontWeight={"600"}
                                            >
                                              DADOS DA DESPESA
                                            </Typography>
                                          </Stack>

                                          <Stack spacing={1} p={1}>
                                            <Stack spacing={0}>
                                              <Typography
                                                color={grey["600"]}
                                                variant="body1"
                                              >
                                                Título da Despesa
                                              </Typography>
                                              <Typography fontWeight={"500"}>
                                                {exp.title}
                                              </Typography>
                                            </Stack>

                                            <Stack spacing={0}>
                                              <Typography
                                                color={grey["600"]}
                                                variant="body1"
                                              >
                                                Descrição da Despesa
                                              </Typography>
                                              <Typography fontWeight={"500"}>
                                                {exp.description}
                                              </Typography>
                                            </Stack>

                                            <Grid container spacing={0}>
                                              <Grid item xs={6}>
                                                <Stack spacing={0}>
                                                  <Typography
                                                    color={grey["600"]}
                                                    variant="body1"
                                                  >
                                                    Valor da Despesa
                                                  </Typography>
                                                  <Typography
                                                    fontWeight={"500"}
                                                  >
                                                    {formatCurrency(exp.value)}
                                                  </Typography>
                                                </Stack>
                                              </Grid>

                                              <Grid item xs={6}>
                                                <Stack spacing={0}>
                                                  <Typography
                                                    color={grey["600"]}
                                                    variant="body1"
                                                  >
                                                    Data de Vencimento
                                                  </Typography>
                                                  <Typography
                                                    fontWeight={"500"}
                                                  >
                                                    {formatDate(exp.due_date)}
                                                  </Typography>
                                                </Stack>
                                              </Grid>
                                            </Grid>

                                            <Stack spacing={0}>
                                              <Typography
                                                color={grey["600"]}
                                                variant="body1"
                                              >
                                                Status do Pagamento
                                              </Typography>
                                              <Chip
                                                label={
                                                  handlePaymentStatus(
                                                    exp.payment_status
                                                  ).label
                                                }
                                                color={
                                                  handlePaymentStatus(
                                                    exp.payment_status
                                                  ).color
                                                }
                                                sx={{ width: "fit-content" }}
                                              />
                                            </Stack>

                                            <Stack direction={"row"} gap={1}>
                                              <Button
                                                startIcon={<FiTrash2 />}
                                                variant="contained"
                                                color="error"
                                                onClick={() =>
                                                  deleteMoviment(exp.id)
                                                }
                                              >
                                                Excluir
                                              </Button>

                                              <Button
                                                startIcon={<AiOutlineEdit />}
                                                variant="contained"
                                                onClick={() =>
                                                  navigate(
                                                    `/dashboard/financeiro/movimentos/editar/${exp.id}`
                                                  )
                                                }
                                              >
                                                Editar
                                              </Button>
                                            </Stack>
                                          </Stack>
                                        </Box>
                                      </Box>
                                    </Collapse>
                                  </TableCell>
                                </TableRow>
                              </>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </DefaultContainer>
                </Box>
              </Grid>
            </Grid>
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
