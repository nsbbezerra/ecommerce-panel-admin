import {
  Box,
  Card,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Fragment, memo, useEffect, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineClear,
  AiOutlineDollar,
  AiOutlineDollarCircle,
  AiOutlineEdit,
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlinePrinter,
  AiOutlineSave,
  AiOutlineSearch,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineTags,
  AiOutlineUser,
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
import Tooltip from "../../components/layout/Tooltip";
import EmptyBox from "../../components/layout/EmptyBox";
import {
  GetOrderByIdEntity,
  PaymentLocalIntentProps,
} from "../../services/entities/orders";
import Avatar from "../../components/layout/Avatar";
import { blue, green, grey, orange, purple, red } from "@mui/material/colors";
import { AddressesEntity } from "../../services/entities/address";
import { TbListDetails } from "react-icons/tb";
import handlePayForm from "../../helpers/handlePayForm";
import { MdCurrencyExchange } from "react-icons/md";
import handlePaymentStatus from "../../helpers/hanldePaymentStatus";
import getSuccessMessage from "../../helpers/getMessageSuccess";
import { FaCircle } from "react-icons/fa";

interface OrdersProps {
  id: string;
  client: { id: string; name: string };
  order_status:
    | "PAYMENT"
    | "PROCCESSING"
    | "PRODUCTION"
    | "PACKING"
    | "SHIPPING"
    | "FINISH"
    | "CANCELED";
  payment_status: "WAITING" | "PAID_OUT" | "REFUSED";
  sub_total: string | number;
  created_at: Date | string;
  payment_mode?: string | null;
  order_from: "WEB" | "PDV";
  code: string;
}

interface CollapseProps {
  movId: string;
  open: boolean;
}

interface ShippingModal {
  id: string;
  isOpen: boolean;
}

const SalesFinished = () => {
  const navigate = useNavigate();

  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [search, setSearch] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<string>("ALL");
  const [searchOrigin, setSearchOrigin] = useState<string>("ALL");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);

  const [paymentStatusDialog, setPaymentStatusDialog] =
    useState<boolean>(false);
  const [shippingDialog, setShippingDialog] = useState<ShippingModal>({
    isOpen: false,
    id: "",
  });

  const [orders, setOrders] = useState<OrdersProps[]>([]);
  const [orderDetails, setOrderDetails] = useState<GetOrderByIdEntity | null>(
    null
  );

  const [paymentId, setPaymentId] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [shippingCode, setShippingCode] = useState<string>("");
  const [shippingUrl, setShippingUrl] = useState<string>("");

  const [openCollapse, setOpenCollapse] = useState<CollapseProps>({
    movId: "",
    open: false,
  });

  function resetSearch() {
    setStartDate(subDays(new Date(), 30));
    setEndDate(new Date());
    setSearchOrigin("ALL");
    setSearchStatus("ALL");
    setSearch("");
  }

  function getFinishedOrders() {
    setIsLoading(true);
    api
      .post("/orders/get-finish-orders", {
        startDate,
        endDate,
        search,
        status: searchStatus,
        origin: searchOrigin,
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

  function getOrderDetails(id: string) {
    const isOpen =
      openCollapse.movId === id && openCollapse.open ? false : true;

    setOpenCollapse({
      movId: id,
      open: isOpen,
    });
    if (isOpen) {
      setDetailsLoading(true);
      api
        .get(`/orders/get-by-id/${id}`)
        .then((response) => {
          setOrderDetails(response.data);
          setDetailsLoading(false);
        })
        .catch((error) => {
          getErrorMessage({ error });
          setDetailsLoading(false);
        });
    } else {
      setOrderDetails(null);
    }
  }

  function handleDefaultAddress(address: AddressesEntity[]): string {
    const result = address[0];
    if (result) {
      return `${result.street}, ${result.number}, ${result.district}, CEP: ${result.cep}, ${result.city} - ${result.state}`;
    } else {
      return "";
    }
  }

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
  }

  function handleStatusPayment(id: string, status: string) {
    setPaymentId(id);
    setPaymentStatus(status);
    setPaymentStatusDialog(true);
  }

  function updatePaymentStatus(value: string) {
    setPaymentStatus(value);
    if (orderDetails) {
      const updated = orderDetails.PaymentLocalIntent.map((obj) => {
        if (obj.id === paymentId) {
          return { ...obj, status: value };
        }
        return obj;
      });
      setOrderDetails({
        ...orderDetails,
        PaymentLocalIntent: updated as PaymentLocalIntentProps[],
      });
    }
  }

  function handleSetShippingInformation() {
    if (orderDetails) {
      setOrderDetails({
        ...orderDetails,
        shipping_code: shippingCode,
        shipping_tracking_url: shippingUrl,
      });
    }
    setShippingDialog({
      id: "",
      isOpen: false,
    });
  }

  function updateOrderDetails() {
    setUpdateLoading(true);
    const intents = orderDetails?.PaymentLocalIntent.map((intent) => {
      return { paymentIntentId: intent.id, status: intent.status };
    });
    api
      .put("/orders/update-finish-order", {
        orderId: orderDetails?.id || "",
        order_status: orderDetails?.order_status as string,
        shipping_code: orderDetails?.shipping_code as string,
        shipping_tracking_url: orderDetails?.shipping_tracking_url as string,
        intents,
      })
      .then((response) => {
        setUpdateLoading(false);
        getSuccessMessage({ message: response.data.message });
        getFinishedOrders();
      })
      .catch((error) => {
        setUpdateLoading(false);
        getErrorMessage({ error });
      });
  }

  useEffect(() => {
    getFinishedOrders();
  }, []);

  useEffect(() => {
    if (!shippingDialog.isOpen) {
      setShippingCode("");
      setShippingUrl("");
    }
  }, [shippingDialog.isOpen]);

  return (
    <Fragment>
      <AppBar title="Vendas Finalizadas" />
      <Container>
        <Stack p={2} spacing={2}>
          <Box
            boxShadow={"0px 0px 9px rgba(0, 0, 0, 0.05)"}
            borderRadius={"4px"}
            overflow={"hidden"}
            p={1}
            bgcolor={"#fff"}
            sx={{ overflowX: "auto" }}
          >
            <ToggleButtonGroup
              color="primary"
              exclusive
              aria-label="Platform"
              value={"finish"}
            >
              <ToggleButton
                sx={{ flexShrink: 0 }}
                value="pdv"
                onClick={() => navigate("/dashboard/vendas")}
              >
                <AiOutlineShoppingCart style={{ marginRight: "10px" }} />
                BALCÃO DE VENDAS
              </ToggleButton>
              <ToggleButton sx={{ flexShrink: 0 }} value="finish">
                <AiOutlineShopping style={{ marginRight: "10px" }} />
                VENDAS FINALIZADAS
              </ToggleButton>
              <ToggleButton
                sx={{ flexShrink: 0 }}
                value="save"
                onClick={() => navigate("/dashboard/vendas/salvas")}
              >
                <AiOutlineSave style={{ marginRight: "10px" }} />
                VENDAS SALVAS
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <DefaultContainer disabledPadding>
            <Grid container spacing={2} alignItems={"center"}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small" variant="filled">
                  <InputLabel id="demo-simple-select-label">
                    Busque por status
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Age"
                    value={searchStatus}
                    onChange={(e) => setSearchStatus(e.target.value)}
                  >
                    <MenuItem value={"ALL"}>
                      <FaCircle
                        color={grey["400"]}
                        style={{ marginRight: "7px" }}
                      />{" "}
                      Todos
                    </MenuItem>
                    <MenuItem value={"PAYMENT"}>
                      <FaCircle
                        color={orange["700"]}
                        style={{ marginRight: "7px" }}
                      />{" "}
                      Aguardando Pagamento
                    </MenuItem>
                    <MenuItem value={"PROCCESSING"}>
                      <FaCircle
                        color={purple["500"]}
                        style={{ marginRight: "7px" }}
                      />{" "}
                      Em Processamento
                    </MenuItem>
                    <MenuItem value={"PRODUCTION"}>
                      <FaCircle
                        color={blue["700"]}
                        style={{ marginRight: "7px" }}
                      />{" "}
                      Em Preparação
                    </MenuItem>
                    <MenuItem value={"PACKING"}>
                      <FaCircle
                        color={blue["500"]}
                        style={{ marginRight: "7px" }}
                      />{" "}
                      Empacotando
                    </MenuItem>
                    <MenuItem value={"SHIPPING"}>
                      <FaCircle
                        color={green["700"]}
                        style={{ marginRight: "7px" }}
                      />{" "}
                      Enviada
                    </MenuItem>
                    <MenuItem value={"SHIPPING"}>
                      <FaCircle
                        color={red["700"]}
                        style={{ marginRight: "7px" }}
                      />{" "}
                      Cancelada
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small" variant="filled">
                  <InputLabel id="demo-simple-select-label">
                    Busque Origem
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Age"
                    value={searchOrigin}
                    onChange={(e) => setSearchOrigin(e.target.value)}
                  >
                    <MenuItem value={"ALL"}>Todos</MenuItem>
                    <MenuItem value={"PDV"}>PDV</MenuItem>
                    <MenuItem value={"WEB"}>WEB</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
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
                    disabled={searchStatus !== "ALL"}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
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
                    disabled={searchStatus !== "ALL"}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <InputText
                  label="Busque por cliente ou Código"
                  fullWidth
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  disabled={searchStatus !== "ALL"}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<AiOutlineClear />}
                      size="large"
                      color="error"
                      onClick={resetSearch}
                    >
                      Limpar
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
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
              </Grid>
            </Grid>
          </DefaultContainer>

          {searchStatus === "ALL" ? (
            <Typography variant="body2" fontWeight={"600"} color={"GrayText"}>
              Resultados dos últimos {differenceInDays(endDate, startDate)} dias
            </Typography>
          ) : (
            <Typography variant="body2" fontWeight={"600"} color={"GrayText"}>
              Mostrando {orders.length} resultados
            </Typography>
          )}

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
                          <TableCell sx={{ maxWidth: "60px" }}>
                            Código
                          </TableCell>
                          <TableCell sx={{ minWidth: "250px" }}>
                            Cliente
                          </TableCell>
                          <TableCell sx={{ width: "130px" }}>Status</TableCell>
                          <TableCell sx={{ width: "70px" }}>
                            Pagamento
                          </TableCell>
                          <TableCell sx={{ width: "120px", minWidth: "120px" }}>
                            Origem
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
                          <>
                            <TableRow
                              key={ord.id}
                              hover
                              sx={{ "& > *": { borderBottom: 0 } }}
                            >
                              <TableCell
                                sx={{ maxWidth: "100px", borderBottom: 0 }}
                              >
                                <Tooltip
                                  title={ord.code}
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
                                    {ord.code}
                                  </Typography>
                                </Tooltip>
                              </TableCell>
                              <TableCell
                                sx={{ minWidth: "250px", borderBottom: 0 }}
                              >
                                {ord.client.name || ""}
                              </TableCell>
                              <TableCell
                                sx={{ width: "130px", borderBottom: 0 }}
                              >
                                <Stack
                                  direction={"row"}
                                  spacing={1}
                                  alignItems={"center"}
                                >
                                  <>
                                    {ord.order_status === "PAYMENT" && (
                                      <Chip
                                        size="small"
                                        label="Processando pagamento"
                                        color="warning"
                                      />
                                    )}
                                    {ord.order_status === "PRODUCTION" && (
                                      <Chip
                                        size="small"
                                        label="Em preparação"
                                        color="info"
                                      />
                                    )}
                                    {ord.order_status === "FINISH" && (
                                      <Chip
                                        size="small"
                                        label="Pedido finalizado"
                                        color="success"
                                      />
                                    )}
                                    {ord.order_status === "PACKING" && (
                                      <Chip
                                        size="small"
                                        label="Empacotando"
                                        color="info"
                                      />
                                    )}
                                    {ord.order_status === "PROCCESSING" && (
                                      <Chip
                                        size="small"
                                        label="Processando"
                                        color="secondary"
                                      />
                                    )}
                                    {ord.order_status === "SHIPPING" && (
                                      <Chip
                                        size="small"
                                        label="Em trânsito"
                                        color="success"
                                      />
                                    )}
                                    {ord.order_status === "CANCELED" && (
                                      <Chip
                                        size="small"
                                        label="Cancelada"
                                        color="error"
                                      />
                                    )}
                                  </>
                                </Stack>
                              </TableCell>
                              <TableCell
                                sx={{ width: "70px", borderBottom: 0 }}
                              >
                                <Stack
                                  direction={"row"}
                                  spacing={1}
                                  alignItems={"center"}
                                >
                                  <Chip
                                    size="small"
                                    label={ord.payment_mode || ""}
                                  />
                                  <>
                                    {ord.payment_status === "PAID_OUT" && (
                                      <>
                                        <Chip
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
                                      </>
                                    )}
                                    {ord.payment_status === "REFUSED" && (
                                      <>
                                        <Chip
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
                                      </>
                                    )}
                                  </>
                                </Stack>
                              </TableCell>
                              <TableCell sx={{ borderBottom: 0 }}>
                                <Chip
                                  label={ord.order_from}
                                  size="small"
                                  color="primary"
                                />
                              </TableCell>
                              <TableCell
                                sx={{
                                  width: "150px",
                                  textAlign: "right",
                                  borderBottom: 0,
                                }}
                              >
                                {new Intl.DateTimeFormat("pt-BR").format(
                                  new Date(ord.created_at)
                                )}
                              </TableCell>
                              <TableCell
                                sx={{
                                  width: "150px",
                                  textAlign: "right",
                                  borderBottom: 0,
                                }}
                              >
                                {formatCurrency(ord.sub_total)}
                              </TableCell>
                              <TableCell
                                sx={{
                                  maxWidth: "70px",
                                  textAlign: "center",
                                  borderBottom: 0,
                                }}
                              >
                                <Stack
                                  direction={"row"}
                                  justifyContent={"center"}
                                >
                                  <IconButton size="small" color="primary">
                                    <AiOutlinePrinter />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => getOrderDetails(ord.id)}
                                  >
                                    {openCollapse.movId === ord.id &&
                                    openCollapse.open ? (
                                      <AiOutlineMinus />
                                    ) : (
                                      <AiOutlinePlus />
                                    )}
                                  </IconButton>
                                </Stack>
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell
                                colSpan={8}
                                style={{ paddingBottom: 0, paddingTop: 0 }}
                              >
                                <Collapse
                                  in={
                                    openCollapse.movId === ord.id &&
                                    openCollapse.open
                                  }
                                >
                                  <Box py={2}>
                                    {detailsLoading ? (
                                      <Loading />
                                    ) : (
                                      <>
                                        {!orderDetails ? (
                                          <EmptyBox label="Nenhuma informação disponível" />
                                        ) : (
                                          <Card
                                            variant="elevation"
                                            elevation={0}
                                            sx={{ p: 2, bgcolor: grey["100"] }}
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
                                                <AiOutlineUser />
                                                <Typography
                                                  variant="body2"
                                                  fontWeight={"600"}
                                                >
                                                  DADOS DO CLIENTE
                                                </Typography>
                                              </Stack>
                                              <Grid container spacing={2} p={2}>
                                                <Grid item xs={4}>
                                                  <Stack spacing={1}>
                                                    <Typography
                                                      color={grey["600"]}
                                                      variant="body2"
                                                    >
                                                      Nome
                                                    </Typography>
                                                    <Typography
                                                      fontWeight={"500"}
                                                    >
                                                      {orderDetails.client.name}
                                                    </Typography>
                                                  </Stack>
                                                </Grid>
                                                <Grid item xs={4}>
                                                  <Stack spacing={1}>
                                                    <Typography
                                                      color={grey["600"]}
                                                      variant="body2"
                                                    >
                                                      Telefone
                                                    </Typography>
                                                    <Typography
                                                      fontWeight={"500"}
                                                    >
                                                      {
                                                        orderDetails.client
                                                          .phone
                                                      }
                                                    </Typography>
                                                  </Stack>
                                                </Grid>
                                                <Grid item xs={4}>
                                                  <Stack spacing={1}>
                                                    <Typography
                                                      color={grey["600"]}
                                                      variant="body2"
                                                    >
                                                      Email
                                                    </Typography>
                                                    <Typography
                                                      fontWeight={"500"}
                                                    >
                                                      {
                                                        orderDetails.client
                                                          .email
                                                      }
                                                    </Typography>
                                                  </Stack>
                                                </Grid>
                                                {orderDetails.client
                                                  .Addresses[0] && (
                                                  <Grid item xs={12}>
                                                    <Stack spacing={1}>
                                                      <Typography
                                                        color={grey["600"]}
                                                        variant="body2"
                                                      >
                                                        Endereço
                                                      </Typography>
                                                      <Typography
                                                        fontWeight={"500"}
                                                      >
                                                        {handleDefaultAddress(
                                                          orderDetails.client
                                                            .Addresses
                                                        )}
                                                      </Typography>
                                                    </Stack>
                                                  </Grid>
                                                )}
                                              </Grid>
                                            </Box>

                                            <Box
                                              bgcolor={"#FFF"}
                                              borderRadius={"4px"}
                                              overflow={"hidden"}
                                              mt={2}
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
                                                <AiOutlineShoppingCart />
                                                <Typography
                                                  variant="body2"
                                                  fontWeight={"600"}
                                                >
                                                  DADOS DA COMPRA
                                                </Typography>
                                              </Stack>
                                              <Grid container spacing={2} p={2}>
                                                <Grid item xs={4}>
                                                  <Stack spacing={1}>
                                                    <Typography
                                                      color={grey["600"]}
                                                      variant="body1"
                                                    >
                                                      ID
                                                    </Typography>
                                                    <Typography
                                                      fontWeight={"500"}
                                                    >
                                                      {orderDetails.id}
                                                    </Typography>
                                                  </Stack>
                                                </Grid>

                                                <Grid item xs={4}>
                                                  <Stack spacing={1}>
                                                    <Typography
                                                      color={grey["600"]}
                                                      variant="body1"
                                                    >
                                                      Código da Compra
                                                    </Typography>
                                                    <Typography
                                                      fontWeight={"500"}
                                                    >
                                                      {orderDetails.code}
                                                    </Typography>
                                                  </Stack>
                                                </Grid>

                                                <Grid item xs={12}>
                                                  <Grid
                                                    container
                                                    spacing={2}
                                                    alignItems={"center"}
                                                  >
                                                    <Grid item xs={4}>
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
                                                              orderDetails.payment_status
                                                            ).label
                                                          }
                                                          color={
                                                            handlePaymentStatus(
                                                              orderDetails.payment_status
                                                            ).color
                                                          }
                                                          sx={{
                                                            width:
                                                              "fit-content",
                                                          }}
                                                        />
                                                      </Stack>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                      <Stack
                                                        direction={"row"}
                                                        spacing={2}
                                                      >
                                                        <Button
                                                          startIcon={
                                                            <TbListDetails />
                                                          }
                                                          variant="outlined"
                                                          disabled={
                                                            ord.payment_mode ===
                                                            "LOCAL"
                                                          }
                                                        >
                                                          Detalhes do Pagamento
                                                        </Button>
                                                        <Button
                                                          startIcon={
                                                            <AiOutlineDollar />
                                                          }
                                                          variant="outlined"
                                                          disabled={
                                                            ord.payment_mode ===
                                                            "LOCAL"
                                                          }
                                                          onClick={() =>
                                                            navigate(
                                                              `/dashboard/vendas/checkout/${ord.id}`
                                                            )
                                                          }
                                                        >
                                                          Pagar Novamente
                                                        </Button>
                                                      </Stack>
                                                    </Grid>
                                                  </Grid>
                                                </Grid>

                                                {ord.payment_mode ===
                                                  "LOCAL" && (
                                                  <>
                                                    <Grid item xs={12}>
                                                      <Chip
                                                        label={`${handlePayForm(
                                                          orderDetails.pay_form
                                                        )} - ${
                                                          orderDetails.installments
                                                        }x`}
                                                        size="medium"
                                                        color="primary"
                                                      />
                                                      <Grid
                                                        container
                                                        spacing={2}
                                                        mt={0.5}
                                                      >
                                                        {orderDetails.PaymentLocalIntent.map(
                                                          (payment) => (
                                                            <Grid
                                                              item
                                                              xs={3}
                                                              key={payment.id}
                                                            >
                                                              <Card
                                                                elevation={0}
                                                                sx={{
                                                                  bgcolor:
                                                                    (payment.status ===
                                                                      "PAID_OUT" &&
                                                                      green[
                                                                        "700"
                                                                      ]) ||
                                                                    (payment.status ===
                                                                      "REFUSED" &&
                                                                      red[
                                                                        "700"
                                                                      ]) ||
                                                                    (payment.status ===
                                                                      "WAITING" &&
                                                                      orange[
                                                                        "800"
                                                                      ]) ||
                                                                    blue["700"],
                                                                  color: "#FFF",
                                                                  px: 2,
                                                                  py: 1,
                                                                  position:
                                                                    "relative",
                                                                }}
                                                              >
                                                                <IconButton
                                                                  size="small"
                                                                  sx={{
                                                                    bgcolor:
                                                                      "#FFF",
                                                                    ":hover": {
                                                                      bgcolor:
                                                                        "#FFF",
                                                                    },
                                                                    position:
                                                                      "absolute",
                                                                    top: 7,
                                                                    right: 15,
                                                                  }}
                                                                  onClick={() =>
                                                                    handleStatusPayment(
                                                                      payment.id,
                                                                      payment.status
                                                                    )
                                                                  }
                                                                >
                                                                  <MdCurrencyExchange />
                                                                </IconButton>

                                                                <Stack
                                                                  spacing={0}
                                                                >
                                                                  <Typography
                                                                    fontWeight={
                                                                      "600"
                                                                    }
                                                                    fontSize={
                                                                      "20px"
                                                                    }
                                                                  >
                                                                    {handlePayForm(
                                                                      payment.pay_form
                                                                    )}
                                                                  </Typography>
                                                                  <Stack
                                                                    direction={
                                                                      "row"
                                                                    }
                                                                    justifyContent={
                                                                      "space-between"
                                                                    }
                                                                  >
                                                                    <Typography>
                                                                      {formatCurrency(
                                                                        payment.total
                                                                      )}
                                                                    </Typography>
                                                                    <Typography>
                                                                      {formatDate(
                                                                        payment.due_date
                                                                      )}
                                                                    </Typography>
                                                                  </Stack>
                                                                </Stack>
                                                              </Card>
                                                            </Grid>
                                                          )
                                                        )}
                                                      </Grid>

                                                      <Button
                                                        startIcon={
                                                          <AiOutlinePrinter />
                                                        }
                                                        variant="outlined"
                                                        sx={{ mt: 2 }}
                                                        disabled={
                                                          orderDetails.pay_form !==
                                                          "trade_note"
                                                        }
                                                      >
                                                        Imprimir Comprovantes
                                                      </Button>
                                                    </Grid>
                                                  </>
                                                )}

                                                <Grid item xs={12}>
                                                  <FormControl>
                                                    <FormLabel id="order-status">
                                                      Status da Compra
                                                    </FormLabel>
                                                    <RadioGroup
                                                      row
                                                      aria-labelledby="order-status"
                                                      name="order_status"
                                                      value={
                                                        orderDetails.order_status
                                                      }
                                                      onChange={(e) =>
                                                        setOrderDetails({
                                                          ...orderDetails,
                                                          order_status:
                                                            e.target.value,
                                                        })
                                                      }
                                                    >
                                                      <FormControlLabel
                                                        value="PAYMENT"
                                                        control={<Radio />}
                                                        label="Pagamento"
                                                      />
                                                      <FormControlLabel
                                                        value="PROCCESSING"
                                                        control={<Radio />}
                                                        label="Processando"
                                                      />
                                                      <FormControlLabel
                                                        value="PRODUCTION"
                                                        control={<Radio />}
                                                        label="Em Separação"
                                                      />
                                                      <FormControlLabel
                                                        value="PACKING"
                                                        control={<Radio />}
                                                        label="Embalando"
                                                      />
                                                      <FormControlLabel
                                                        value="SHIPPING"
                                                        control={<Radio />}
                                                        label="Enviado"
                                                      />
                                                      <FormControlLabel
                                                        value="FINISH"
                                                        control={<Radio />}
                                                        label="Finalizado"
                                                      />
                                                    </RadioGroup>
                                                  </FormControl>
                                                </Grid>

                                                <Grid item xs={4}>
                                                  <Stack spacing={1}>
                                                    <Typography
                                                      color={grey["600"]}
                                                      variant="body1"
                                                    >
                                                      Código de Rastreio
                                                    </Typography>
                                                    <Stack
                                                      direction={"row"}
                                                      spacing={2}
                                                      alignItems={"center"}
                                                    >
                                                      <Typography
                                                        fontWeight={"500"}
                                                      >
                                                        {orderDetails.shipping_code ||
                                                          "-"}
                                                      </Typography>
                                                      <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() =>
                                                          setShippingDialog({
                                                            isOpen: true,
                                                            id: orderDetails.id,
                                                          })
                                                        }
                                                      >
                                                        <AiOutlineEdit />
                                                      </IconButton>
                                                    </Stack>
                                                  </Stack>
                                                </Grid>
                                                <Grid item xs={8}>
                                                  <Stack spacing={1}>
                                                    <Typography
                                                      color={grey["600"]}
                                                      variant="body1"
                                                    >
                                                      URL de Rastreio
                                                    </Typography>
                                                    <Stack
                                                      direction={"row"}
                                                      spacing={2}
                                                      alignItems={"center"}
                                                    >
                                                      <Typography
                                                        fontWeight={"500"}
                                                      >
                                                        {orderDetails.shipping_tracking_url ||
                                                          "-"}
                                                      </Typography>
                                                      <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() =>
                                                          setShippingDialog({
                                                            isOpen: true,
                                                            id: orderDetails.id,
                                                          })
                                                        }
                                                      >
                                                        <AiOutlineEdit />
                                                      </IconButton>
                                                    </Stack>
                                                  </Stack>
                                                </Grid>

                                                <Grid item xs={12}>
                                                  <Grid
                                                    container
                                                    spacing={2}
                                                    justifyContent={"flex-end"}
                                                  >
                                                    <Grid item xs={2}>
                                                      <Button
                                                        size="large"
                                                        variant="contained"
                                                        fullWidth
                                                        startIcon={
                                                          <AiOutlineSave />
                                                        }
                                                        loading={updateLoading}
                                                        onClick={
                                                          updateOrderDetails
                                                        }
                                                      >
                                                        Salvar
                                                      </Button>
                                                    </Grid>
                                                  </Grid>
                                                </Grid>
                                              </Grid>
                                            </Box>

                                            <Box
                                              bgcolor={"#FFF"}
                                              borderRadius={"4px"}
                                              overflow={"hidden"}
                                              mt={2}
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
                                                <AiOutlineTags />
                                                <Typography
                                                  variant="body2"
                                                  fontWeight={"600"}
                                                >
                                                  PRODUTOS DA COMPRA
                                                </Typography>
                                              </Stack>
                                              <Stack p={2}>
                                                {orderDetails?.OrderItems.map(
                                                  (items, index, array) => (
                                                    <>
                                                      <Box
                                                        key={items.id}
                                                        display={"flex"}
                                                        justifyContent={
                                                          "space-between"
                                                        }
                                                        alignItems={
                                                          "flex-start"
                                                        }
                                                        gap={2}
                                                      >
                                                        <Stack
                                                          direction={"row"}
                                                          spacing={3}
                                                        >
                                                          <Avatar
                                                            src={
                                                              items.product
                                                                .thumbnail || ""
                                                            }
                                                            sx={{
                                                              width: 50,
                                                              height: 50,
                                                            }}
                                                          />
                                                          <Box
                                                            display={"flex"}
                                                            flexDirection={
                                                              "column"
                                                            }
                                                          >
                                                            <Typography>
                                                              {items.product
                                                                .name || ""}
                                                            </Typography>
                                                            <Typography
                                                              variant="caption"
                                                              color={"GrayText"}
                                                            >
                                                              Categoria:{" "}
                                                              {items.product
                                                                .category
                                                                .name || ""}
                                                            </Typography>
                                                            <Typography
                                                              variant="caption"
                                                              color={"GrayText"}
                                                            >
                                                              Sub-categoria:{" "}
                                                              {items.product
                                                                .collection
                                                                .name || ""}
                                                            </Typography>
                                                            <Typography variant="caption">
                                                              Quantidade:{" "}
                                                              {items.quantity ||
                                                                ""}
                                                            </Typography>
                                                            {items.product_options && (
                                                              <Chip
                                                                label={`Opção: ${
                                                                  items
                                                                    .product_options
                                                                    ?.headline ||
                                                                  ""
                                                                }`}
                                                                sx={{
                                                                  width:
                                                                    "min-content",
                                                                }}
                                                              />
                                                            )}
                                                          </Box>
                                                        </Stack>
                                                        <Typography
                                                          fontWeight={"500"}
                                                          variant="body1"
                                                        >
                                                          {formatCurrency(
                                                            items.price
                                                          )}
                                                        </Typography>
                                                      </Box>

                                                      {index + 1 !==
                                                        array.length && (
                                                        <Divider
                                                          sx={{ my: 1 }}
                                                        />
                                                      )}
                                                    </>
                                                  )
                                                )}
                                              </Stack>
                                            </Box>

                                            <Box
                                              bgcolor={"#FFF"}
                                              borderRadius={"4px"}
                                              overflow={"hidden"}
                                              mt={2}
                                              p={2}
                                            >
                                              <Stack
                                                justifyContent={"space-between"}
                                                direction={"row"}
                                              >
                                                <Typography
                                                  variant="subtitle1"
                                                  fontWeight={"500"}
                                                  color={grey["700"]}
                                                >
                                                  TOTAL
                                                </Typography>
                                                <Typography
                                                  variant="subtitle1"
                                                  fontWeight={"500"}
                                                  color={grey["700"]}
                                                >
                                                  {formatCurrency(
                                                    orderDetails.total
                                                  )}
                                                </Typography>
                                              </Stack>
                                              <Divider sx={{ my: 1 }} />
                                              <Stack
                                                justifyContent={"space-between"}
                                                direction={"row"}
                                              >
                                                <Typography
                                                  variant="subtitle1"
                                                  fontWeight={"500"}
                                                  color={grey["700"]}
                                                >
                                                  DESCONTO
                                                </Typography>
                                                <Typography
                                                  variant="subtitle1"
                                                  fontWeight={"500"}
                                                  color={grey["700"]}
                                                >
                                                  % {orderDetails.discount}
                                                </Typography>
                                              </Stack>
                                              <Divider sx={{ my: 1 }} />
                                              <Stack
                                                justifyContent={"space-between"}
                                                direction={"row"}
                                              >
                                                <Typography
                                                  variant="subtitle1"
                                                  fontWeight={"500"}
                                                  color={grey["700"]}
                                                >
                                                  SUB-TOTAL
                                                </Typography>
                                                <Typography
                                                  variant="subtitle1"
                                                  fontWeight={"500"}
                                                  color={grey["700"]}
                                                >
                                                  {formatCurrency(
                                                    orderDetails.sub_total
                                                  )}
                                                </Typography>
                                              </Stack>
                                            </Box>
                                          </Card>
                                        )}
                                      </>
                                    )}
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
              </>
            )}
          </DefaultContainer>
        </Stack>
      </Container>

      <Dialog
        open={paymentStatusDialog}
        onClose={() => setPaymentStatusDialog(false)}
      >
        <DialogContent>
          <FormControl disabled={paymentStatus === "PAID_OUT"}>
            <FormLabel id="order-status">Status do Pagamento</FormLabel>
            <RadioGroup
              row
              aria-labelledby="order-status"
              name="order_status"
              value={paymentStatus}
              onChange={(e) => updatePaymentStatus(e.target.value)}
            >
              <FormControlLabel
                value="WAITING"
                control={<Radio />}
                label="Processando"
              />
              <FormControlLabel
                value="PAID_OUT"
                control={<Radio />}
                label="Pago"
              />
              <FormControlLabel
                value="REFUSED"
                control={<Radio />}
                label="Recusado"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentStatusDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={shippingDialog.isOpen}
        onClose={() =>
          setShippingDialog({
            isOpen: false,
            id: "",
          })
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <Stack spacing={2}>
            <InputText
              label="Código de Rastreio"
              fullWidth
              value={shippingCode}
              onChange={(e) => setShippingCode(e.target.value)}
            />

            <InputText
              label="URL de Rastreio"
              fullWidth
              value={shippingUrl}
              onChange={(e) => setShippingUrl(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setShippingDialog({
                isOpen: false,
                id: "",
              })
            }
            color="error"
          >
            Fechar
          </Button>
          <Button onClick={handleSetShippingInformation}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default memo(SalesFinished);
