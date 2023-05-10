import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Chip,
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
import { useEffect, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineDollarCircle,
  AiOutlineEdit,
  AiOutlineSave,
  AiOutlineSearch,
  AiOutlineShopping,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ptBr from "date-fns/locale/pt-BR";
import InputText from "../../components/layout/InputText";
import Button from "../../components/layout/Button";
import subDays from "date-fns/subDays";
import DefaultContainer from "../../components/layout/DefaultContainer";
import differenceInDays from "date-fns/differenceInDays";
import Loading from "../../components/layout/Loading";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import formatCurrency from "../../helpers/formatCurrency";
import IconButton from "../../components/layout/IconButton";
import { FiChevronDown } from "react-icons/fi";
import Tooltip from "../../components/layout/Tooltip";
import EmptyBox from "../../components/layout/EmptyBox";

interface OrdersProps {
  id: string;
  client: { id: string; name: string };
  order_status:
    | "PAYMENT"
    | "PROCCESSING"
    | "PRODUCTION"
    | "PACKING"
    | "SHIPPING"
    | "FINISH";
  payment_status: "WAITING" | "PAID_OUT" | "REFUSED";
  sub_total: string | number;
  created_at: Date | string;
  payment_mode?: string | null;
  order_from: "WEB" | "PDV";
}

export default function SalesFinished() {
  const navigate = useNavigate();

  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [search, setSearch] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [orders, setOrders] = useState<OrdersProps[]>([]);

  function getFinishedOrders() {
    setIsLoading(true);
    api
      .post("/orders/get-finish-orders", {
        startDate,
        endDate,
        search,
      })
      .then((response) => {
        setIsLoading(false);
        setOrders(response.data);
      })
      .catch((error) => {
        getErrorMessage({ error });
        setIsLoading(false);
      });
  }

  useEffect(() => {
    getFinishedOrders();
  }, []);

  return (
    <Box>
      <AppBar title="Vendas Finalizadas" />
      <Container>
        <Stack padding={"20px"} spacing={2}>
          <Box
            boxShadow={"0px 0px 9px rgba(0, 0, 0, 0.05)"}
            borderRadius={"4px"}
            overflow={"hidden"}
          >
            <BottomNavigation showLabels value={1}>
              <BottomNavigationAction
                label="Balcão"
                icon={
                  <AiOutlineShoppingCart
                    fontSize={20}
                    style={{ marginBottom: "5px" }}
                  />
                }
                onClick={() => navigate("/dashboard/vendas")}
              />
              <BottomNavigationAction
                label="Concluídas"
                icon={
                  <AiOutlineShopping
                    fontSize={20}
                    style={{ marginBottom: "5px" }}
                  />
                }
                onClick={() => navigate("/dashboard/vendas/finalizadas")}
              />
              <BottomNavigationAction
                label="Salvas"
                icon={
                  <AiOutlineSave
                    fontSize={20}
                    style={{ marginBottom: "5px" }}
                  />
                }
                onClick={() => navigate("/dashboard/vendas/salvas")}
              />
            </BottomNavigation>
          </Box>

          <DefaultContainer disabledPadding>
            <Grid container spacing={2} alignItems={"center"}>
              <Grid item xs={12} sm={6} md={3}>
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
              <Grid item xs={12} sm={6} md={3}>
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
              <Grid item xs={12} sm={6} md={3}>
                <InputText
                  label="Busque por cliente ou ID"
                  fullWidth
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AiOutlineSearch />}
                  size="large"
                  onClick={getFinishedOrders}
                >
                  Buscar
                </Button>
              </Grid>
            </Grid>
          </DefaultContainer>

          <Typography variant="body2" fontWeight={"600"} color={"GrayText"}>
            Resultados dos últimos {differenceInDays(endDate, startDate)} dias
          </Typography>

          <DefaultContainer disabledPadding>
            {isLoading ? (
              <Loading />
            ) : (
              <>
                {orders.length === 0 ? (
                  <EmptyBox label="Nenhuma informação encontrada" />
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ maxWidth: "60px" }}>ID</TableCell>
                          <TableCell sx={{ minWidth: "250px" }}>
                            Cliente
                          </TableCell>
                          <TableCell sx={{ width: "130px" }}>Status</TableCell>
                          <TableCell sx={{ width: "70px" }}>
                            Pagamento
                          </TableCell>
                          <TableCell
                            sx={{ width: "150px", textAlign: "right" }}
                          >
                            Data
                          </TableCell>
                          <TableCell
                            sx={{ width: "150px", textAlign: "right" }}
                          >
                            Sub-Total
                          </TableCell>
                          <TableCell
                            sx={{ maxWidth: "10px", textAlign: "center" }}
                          ></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((ord) => (
                          <TableRow key={ord.id} hover>
                            <TableCell sx={{ maxWidth: "60px" }}>
                              <Tooltip
                                title={ord.id}
                                arrow
                                sx={{ fontSize: "14px" }}
                              >
                                <Typography
                                  sx={{
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    cursor: "default",
                                  }}
                                >
                                  {ord.id}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell sx={{ minWidth: "250px" }}>
                              {ord.client.name || ""}
                            </TableCell>
                            <TableCell sx={{ width: "130px" }}>
                              <Stack
                                direction={"row"}
                                spacing={1}
                                alignItems={"center"}
                              >
                                <>
                                  {ord.order_status === "PAYMENT" && (
                                    <Chip
                                      variant="outlined"
                                      size="small"
                                      label="Processando pagamento"
                                      color="warning"
                                    />
                                  )}
                                  {ord.order_status === "FINISH" && (
                                    <Chip
                                      variant="outlined"
                                      size="small"
                                      label="Pedido finalizado"
                                      color="success"
                                    />
                                  )}
                                  {ord.order_status === "PACKING" && (
                                    <Chip
                                      variant="outlined"
                                      size="small"
                                      label="Empacotando"
                                      color="info"
                                    />
                                  )}
                                  {ord.order_status === "PROCCESSING" && (
                                    <Chip
                                      variant="outlined"
                                      size="small"
                                      label="Em preparação"
                                      color="secondary"
                                    />
                                  )}
                                  {ord.order_status === "SHIPPING" && (
                                    <Chip
                                      variant="outlined"
                                      size="small"
                                      label="Em trânsito"
                                      color="success"
                                    />
                                  )}
                                </>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  sx={{ flexShrink: 0 }}
                                >
                                  <AiOutlineEdit />
                                </IconButton>
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ width: "70px" }}>
                              <Stack
                                direction={"row"}
                                spacing={1}
                                alignItems={"center"}
                              >
                                <Chip
                                  variant="outlined"
                                  size="small"
                                  label={ord.payment_mode || ""}
                                />
                                <>
                                  {ord.payment_status === "PAID_OUT" && (
                                    <>
                                      <Chip
                                        variant="outlined"
                                        size="small"
                                        label={
                                          !ord.payment_mode
                                            ? "Nenhum"
                                            : ord.payment_mode === "ONLINE"
                                            ? "Confirmado"
                                            : "Pago"
                                        }
                                        color="success"
                                      />
                                      {ord.payment_mode &&
                                      ord.payment_mode === "ONLINE" ? (
                                        <>
                                          <Tooltip
                                            title="Consultar pagamento"
                                            arrow
                                          >
                                            <IconButton
                                              size="small"
                                              color="primary"
                                              sx={{ flexShrink: 0 }}
                                              onClick={() =>
                                                navigate(
                                                  `/dashboard/vendas/checkout/${ord.id}`
                                                )
                                              }
                                            >
                                              <AiOutlineSearch />
                                            </IconButton>
                                          </Tooltip>
                                        </>
                                      ) : (
                                        <>
                                          <Tooltip title="Ver parcelas" arrow>
                                            <IconButton
                                              size="small"
                                              color="primary"
                                              sx={{ flexShrink: 0 }}
                                              onClick={() =>
                                                navigate(
                                                  `/dashboard/vendas/checkout/${ord.id}`
                                                )
                                              }
                                            >
                                              <AiOutlineSearch />
                                            </IconButton>
                                          </Tooltip>
                                        </>
                                      )}
                                    </>
                                  )}
                                  {ord.payment_status === "REFUSED" && (
                                    <>
                                      <Chip
                                        variant="outlined"
                                        size="small"
                                        label="Erro / Recusado"
                                        color="error"
                                      />
                                      <Tooltip title="Pagar novamente" arrow>
                                        <IconButton
                                          size="small"
                                          color="primary"
                                          sx={{ flexShrink: 0 }}
                                          onClick={() =>
                                            navigate(
                                              `/dashboard/vendas/checkout/${ord.id}`
                                            )
                                          }
                                        >
                                          <AiOutlineDollarCircle />
                                        </IconButton>
                                      </Tooltip>
                                    </>
                                  )}
                                  {ord.payment_status === "WAITING" && (
                                    <>
                                      <Chip
                                        variant="outlined"
                                        size="small"
                                        label={
                                          !ord.payment_mode
                                            ? "Nenhum"
                                            : ord.payment_mode === "ONLINE"
                                            ? "Processando"
                                            : "Aguardando"
                                        }
                                        color="warning"
                                      />
                                      <Tooltip
                                        title="Consultar pagamento"
                                        arrow
                                      >
                                        <IconButton
                                          size="small"
                                          color="primary"
                                          sx={{ flexShrink: 0 }}
                                        >
                                          <AiOutlineSearch />
                                        </IconButton>
                                      </Tooltip>
                                      {ord.payment_mode &&
                                      ord.payment_mode === "ONLINE" ? (
                                        <Tooltip title="Pagar novamente" arrow>
                                          <IconButton
                                            size="small"
                                            color="primary"
                                            sx={{ flexShrink: 0 }}
                                            onClick={() =>
                                              navigate(
                                                `/dashboard/vendas/checkout/${ord.id}`
                                              )
                                            }
                                          >
                                            <AiOutlineDollarCircle />
                                          </IconButton>
                                        </Tooltip>
                                      ) : (
                                        ""
                                      )}
                                    </>
                                  )}
                                </>
                              </Stack>
                            </TableCell>
                            <TableCell
                              sx={{ width: "150px", textAlign: "right" }}
                            >
                              {new Intl.DateTimeFormat("pt-BR").format(
                                new Date(ord.created_at)
                              )}
                            </TableCell>
                            <TableCell
                              sx={{ width: "150px", textAlign: "right" }}
                            >
                              {formatCurrency(ord.sub_total)}
                            </TableCell>
                            <TableCell
                              sx={{ maxWidth: "70px", textAlign: "center" }}
                            >
                              <Stack
                                direction={"row"}
                                justifyContent={"center"}
                              >
                                <IconButton size="small" color="primary">
                                  <FiChevronDown />
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
        </Stack>
      </Container>
    </Box>
  );
}
