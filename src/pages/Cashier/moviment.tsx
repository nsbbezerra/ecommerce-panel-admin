import { Fragment, useEffect, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Chip,
  Collapse,
  Divider,
  Drawer,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
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
import {
  AiOutlineCheck,
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlinePrinter,
  AiOutlineSave,
  AiOutlineTags,
} from "react-icons/ai";
import InputText from "../../components/layout/InputText";
import Button from "../../components/layout/Button";
import Swal from "sweetalert2";
import { blue, green, grey, red } from "@mui/material/colors";
import DefaultContainer from "../../components/layout/DefaultContainer";
import IconButton from "../../components/layout/IconButton";
import { FiChevronDown, FiChevronLeft, FiChevronUp } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi";
import { BsCaretDown, BsDoorClosed } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/layout/Loading";
import EmptyBox from "../../components/layout/EmptyBox";
import { api, apiUrl } from "../../configs/api";
import getSuccessMessage from "../../helpers/getMessageSuccess";
import getErrorMessage from "../../helpers/getMessageError";
import currencyMask from "../../helpers/currencyMask";
import formatCurrency from "../../helpers/formatCurrency";
import handlePayForm from "../../helpers/handlePayForm";
import { GetOrderByIdEntity } from "../../services/entities/orders";
import Avatar from "../../components/layout/Avatar";
import { RiDraftLine } from "react-icons/ri";
import { MdOutlinePayments } from "react-icons/md";
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
  pay_form: string | null;
  installments: number | null;
}

interface CashHandlingProps {
  id: string;
  description: string;
  value: number | string;
  type: "DEPOSIT" | "WITHDRAW";
  cashier_id: string;
  created_at: Date;
}

interface CollapseProps {
  movId: string;
  open: boolean;
}

export default function CashierMoviment() {
  const navigate = useNavigate();
  const { cashier } = useParams();

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [moviment, setMoviment] = useState<string>("");
  const [description, setDescripion] = useState("");
  const [value, setValue] = useState<string>("0,00");

  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);

  const [orders, setOrders] = useState<OrdersProps[]>([]);

  const [cashHandlings, setCashHandlings] = useState<CashHandlingProps[]>([]);

  const [openCollapse, setOpenCollapse] = useState<CollapseProps>({
    movId: "",
    open: false,
  });

  const [orderDetails, setOrderDetails] = useState<GetOrderByIdEntity | null>(
    null
  );

  function handleOpenDrawer(from: "deposit" | "withdraw") {
    from === "deposit" ? setMoviment("DEPOSIT") : setMoviment("WITHDRAW");
    setOpenDrawer(true);
  }

  function getCashierMoviment() {
    api
      .get(`/cashier/moviment/${cashier}`)
      .then((response) => {
        setCashHandlings(response.data);
      })
      .catch((error) => {
        getErrorMessage({ error });
      });
  }

  function saveCashierMoviment() {
    if (moviment === "") {
      Swal.fire({
        title: "Atenção",
        text: "Selecione um tipo de movimentação",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (description === "") {
      Swal.fire({
        title: "Atenção",
        text: "Insira uma descrição",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    setSubmitLoading(true);
    api
      .post("/cashier/moviment", {
        value: value.replace(".", "").replace(",", "."),
        description: description,
        cashierId: cashier,
        type: moviment,
      })
      .then((response) => {
        getSuccessMessage({ message: response.data.message });
        setSubmitLoading(false);
        setOpenDrawer(false);
        setValue("");
        setDescripion("");
        setMoviment("");
        getCashierMoviment();
      })
      .catch((error) => {
        setSubmitLoading(false);
        getErrorMessage({ error });
      });
  }

  function handleFindMoviments(
    from: "deposit" | "withdraw"
  ): CashHandlingProps[] {
    if (from === "deposit") {
      return cashHandlings.filter((obj) => obj.type === "DEPOSIT");
    } else {
      return cashHandlings.filter((obj) => obj.type === "WITHDRAW");
    }
  }

  function calcMovimentValues(mov: CashHandlingProps[]): number {
    return mov.reduce(
      (partialSum, a) => partialSum + parseFloat(a.value as string),
      0
    );
  }

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
  }

  function deleteMoviment(id: string) {
    Swal.fire({
      text: "Deseja remover este evento?",
      title: "Confirmação",
      icon: "question",
      confirmButtonColor: blue["500"],
      denyButtonColor: red["500"],
      confirmButtonText: "Sim",
      denyButtonText: "Não",
      showDenyButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return api
          .delete(`/cashier/moviment/${id}`)
          .then((response) => {
            return response.data;
          })
          .catch((error) => getErrorMessage({ error }));
      },
    }).then((results) => {
      if (results.isConfirmed) {
        getSuccessMessage({ message: results.value.message });
        getCashierMoviment();
      }
    });
  }

  function convertSaleToDraft(id: string) {
    Swal.fire({
      text: "Deseja converter esta venda em rascunho?",
      title: "Confirmação",
      icon: "question",
      confirmButtonColor: blue["500"],
      denyButtonColor: red["500"],
      confirmButtonText: "Sim",
      denyButtonText: "Não",
      showDenyButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return api
          .put(`/orders/convert-to-draft/${id}`)
          .then((response) => {
            return response.data;
          })
          .catch((error) => getErrorMessage({ error }));
      },
    }).then((results) => {
      if (results.isConfirmed) {
        getSuccessMessage({ message: results.value.message });
        getOrders();
      }
    });
  }

  function getOrders() {
    setIsLoading(true);
    api
      .get("/cashier/orders")
      .then((response) => {
        setOrders(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        getErrorMessage({ error });
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

  function setFinishOrder(id: string) {
    Swal.fire({
      title: "Confirmação",
      text: `Deseja finalizar esta venda?`,
      icon: "question",
      showDenyButton: true,
      denyButtonText: "Não",
      denyButtonColor: red["600"],
      confirmButtonText: "Sim",
      confirmButtonColor: blue["500"],
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return api
          .post("/orders/finish-order", {
            orderId: id,
            cashierId: cashier,
          })
          .then((response) => {
            return response.data;
          })
          .catch((error) => getErrorMessage({ error }));
      },
    }).then((result) => {
      if (result.isConfirmed) {
        getOrders();
        getSuccessMessage({ message: result.value.message });
      }
    });
  }

  function calcTotalCashier(): number {
    return (
      calcMovimentValues(handleFindMoviments("deposit")) -
      calcMovimentValues(handleFindMoviments("withdraw"))
    );
  }

  function closeCashier() {
    Swal.fire({
      title: "Confirmação",
      text: `Deseja fechar este caixa?`,
      icon: "question",
      showDenyButton: true,
      denyButtonText: "Não",
      denyButtonColor: red["600"],
      confirmButtonText: "Sim",
      confirmButtonColor: blue["500"],
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return api
          .put("/cashier/close", {
            cashierId: cashier,
            closeValue: calcTotalCashier(),
          })
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            getErrorMessage({ error });
          });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Sucesso",
          text: result.value.message,
          icon: "success",
          confirmButtonColor: blue["500"],
        }).then((results) => {
          if (results.isConfirmed) {
            navigate("/dashboard/caixa");
          }
        });
      }
    });
  }

  function printOrder(id: string) {
    const printUrl = `${apiUrl}/orders/print/${id}`;
    window.open(printUrl, "_blank", "noreferrer");
  }

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    if (cashier) {
      getCashierMoviment();
    }
  }, [cashier]);

  return (
    <Fragment>
      <AppBar title="Caixa Diário" />

      <Container>
        {isLoading ? (
          <Box p={2}>
            <DefaultContainer disabledPadding>
              <Loading />
            </DefaultContainer>
          </Box>
        ) : (
          <Grid container p={2} spacing={2}>
            <Grid item xs={12}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                gap={2}
                flexWrap={"wrap"}
              >
                <Button
                  startIcon={<FiChevronLeft />}
                  onClick={() => navigate("/dashboard/caixa")}
                >
                  Voltar
                </Button>

                <Stack direction={"row"} spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<BsDoorClosed />}
                    onClick={closeCashier}
                  >
                    Fechar caixa
                  </Button>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <DefaultContainer disabledPadding disablePaddingInside>
                {orders.length === 0 ? (
                  <EmptyBox label="Nenhuma informação encontrada" />
                ) : (
                  <TableContainer sx={{ py: 1 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ minWidth: "240px" }}>
                            Cliente
                          </TableCell>
                          <TableCell
                            sx={{
                              width: "150px",
                              minWidth: "150px",
                            }}
                          >
                            Pagamento
                          </TableCell>
                          <TableCell
                            sx={{
                              width: "120px",
                              minWidth: "120px",
                            }}
                          >
                            Data
                          </TableCell>
                          <TableCell
                            sx={{
                              width: "120px",
                              minWidth: "120px",
                              textAlign: "right",
                            }}
                          >
                            Valor
                          </TableCell>
                          <TableCell
                            sx={{ width: "60px", textAlign: "center" }}
                          >
                            Ações
                          </TableCell>
                          <TableCell
                            sx={{
                              width: "10px",
                              maxWidth: "10px",
                              textAlign: "center",
                            }}
                          ></TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {orders.map((order) => (
                          <>
                            <TableRow
                              hover
                              key={order.id}
                              sx={{ "& > *": { borderBottom: "0" } }}
                            >
                              <TableCell sx={{ borderBottom: 0 }}>
                                {order.client.name}
                              </TableCell>
                              <TableCell sx={{ borderBottom: 0 }}>
                                <Stack direction={"row"} spacing={1}>
                                  <Chip
                                    size="small"
                                    label={`${order.installments || 0}x`}
                                  />
                                  <Chip
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    label={handlePayForm(order.pay_form || "")}
                                  />
                                </Stack>
                              </TableCell>
                              <TableCell sx={{ borderBottom: 0 }}>
                                {formatDate(order.created_at as Date)}
                              </TableCell>
                              <TableCell
                                sx={{ textAlign: "right", borderBottom: 0 }}
                              >
                                {formatCurrency(order.sub_total)}
                              </TableCell>
                              <TableCell
                                sx={{ textAlign: "center", borderBottom: 0 }}
                              >
                                <Stack direction={"row"} spacing={1}>
                                  <IconButton
                                    color="primary"
                                    size="small"
                                    onClick={() => printOrder(order.id)}
                                  >
                                    <AiOutlinePrinter />
                                  </IconButton>
                                  <IconButton
                                    color="error"
                                    size="small"
                                    onClick={() => convertSaleToDraft(order.id)}
                                  >
                                    <RiDraftLine />
                                  </IconButton>
                                  {handlePayForm(order.pay_form || "") ===
                                  "Nenhum" ? (
                                    <IconButton
                                      color="info"
                                      size="small"
                                      onClick={() =>
                                        navigate(
                                          `/dashboard/vendas/checkout/${order.id}`
                                        )
                                      }
                                    >
                                      <MdOutlinePayments />
                                    </IconButton>
                                  ) : (
                                    <IconButton
                                      color="success"
                                      size="small"
                                      onClick={() => setFinishOrder(order.id)}
                                    >
                                      <AiOutlineCheck />
                                    </IconButton>
                                  )}
                                </Stack>
                              </TableCell>
                              <TableCell
                                sx={{ textAlign: "center", borderBottom: 0 }}
                              >
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => getOrderDetails(order.id)}
                                >
                                  {openCollapse.movId === order.id &&
                                  openCollapse.open ? (
                                    <FiChevronUp />
                                  ) : (
                                    <FiChevronDown />
                                  )}
                                </IconButton>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={6} style={{ padding: 0 }}>
                                <Collapse
                                  in={
                                    openCollapse.movId === order.id &&
                                    openCollapse.open
                                  }
                                >
                                  <Box p={1}>
                                    {detailsLoading ? (
                                      <Loading />
                                    ) : (
                                      <>
                                        {!orderDetails ? (
                                          <EmptyBox label="Nenhuma informação disponível" />
                                        ) : (
                                          <Card
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
                                                <AiOutlineTags />
                                                <Typography
                                                  variant="body2"
                                                  fontWeight={"600"}
                                                >
                                                  PRODUTOS DA COMPRA
                                                </Typography>
                                              </Stack>
                                              <Grid container spacing={1} p={2}>
                                                <Grid item xs={12}>
                                                  <Stack>
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
                                                                    .thumbnail ||
                                                                  ""
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
                                                                  color={
                                                                    "GrayText"
                                                                  }
                                                                >
                                                                  Categoria:{" "}
                                                                  {items.product
                                                                    .category
                                                                    .name || ""}
                                                                </Typography>
                                                                <Typography
                                                                  variant="caption"
                                                                  color={
                                                                    "GrayText"
                                                                  }
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
                                                </Grid>
                                              </Grid>
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
              </DefaultContainer>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{ boxShadow: "0px 0px 9px rgba(0, 0, 0, 0.05)" }}
                bgcolor={
                  calcTotalCashier() === 0
                    ? grey["400"]
                    : calcTotalCashier() > 0
                    ? green["100"]
                    : red["100"]
                }
                borderRadius={"4px"}
                px={2}
                py={1}
                color={
                  calcTotalCashier() === 0
                    ? grey["800"]
                    : calcTotalCashier() > 0
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
                    {formatCurrency(calcTotalCashier())}
                  </Typography>
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Accordion
                elevation={0}
                sx={{
                  boxShadow: "0px 0px 9px rgba(0, 0, 0, 0.05)",
                  overflow: "hidden",
                }}
              >
                <AccordionSummary
                  expandIcon={<BsCaretDown color="#FFF" />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                  sx={{
                    fontWeight: "bold",
                    background: green["700"],
                    color: "#FFF",
                  }}
                >
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    width={"100%"}
                    pr={2}
                  >
                    <Typography>DEPÓSITOS</Typography>
                    <Typography fontWeight={"bold"}>
                      {formatCurrency(
                        calcMovimentValues(handleFindMoviments("deposit"))
                      )}
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  {!handleFindMoviments("deposit").length ? (
                    <EmptyBox label="Nenhuma informação encontrada" />
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Valor</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell sx={{ width: "20px" }}>Ações</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {handleFindMoviments("deposit").map((mov) => (
                            <>
                              <TableRow
                                hover
                                key={mov.id}
                                sx={{ "& > *": { borderBottom: "0" } }}
                              >
                                <TableCell sx={{ borderBottom: 0 }}>
                                  {formatCurrency(mov.value)}
                                </TableCell>
                                <TableCell sx={{ borderBottom: 0 }}>
                                  {formatDate(mov.created_at)}
                                </TableCell>
                                <TableCell
                                  sx={{ width: "20px", borderBottom: 0 }}
                                >
                                  <Stack direction={"row"} spacing={1}>
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() =>
                                        setOpenCollapse({
                                          movId: mov.id,
                                          open:
                                            openCollapse.movId === mov.id &&
                                            openCollapse.open
                                              ? false
                                              : true,
                                        })
                                      }
                                    >
                                      {openCollapse.movId === mov.id &&
                                      openCollapse.open ? (
                                        <FiChevronUp />
                                      ) : (
                                        <FiChevronDown />
                                      )}
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => deleteMoviment(mov.id)}
                                    >
                                      <HiOutlineTrash />
                                    </IconButton>
                                  </Stack>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  colSpan={3}
                                  style={{ paddingBottom: 0, paddingTop: 0 }}
                                >
                                  <Collapse
                                    in={
                                      openCollapse.movId === mov.id &&
                                      openCollapse.open
                                    }
                                  >
                                    <Box p={1}>
                                      <Typography
                                        color={grey["700"]}
                                        variant="body2"
                                      >
                                        {mov.description}
                                      </Typography>
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

                  <Button
                    startIcon={<AiOutlinePlus />}
                    sx={{ mt: 2 }}
                    onClick={() => handleOpenDrawer("deposit")}
                  >
                    Adicionar Novo
                  </Button>
                </AccordionDetails>
              </Accordion>
            </Grid>

            <Grid item xs={12} md={6}>
              <Accordion
                elevation={0}
                sx={{
                  boxShadow: "0px 0px 9px rgba(0, 0, 0, 0.05)",
                  overflow: "hidden",
                }}
              >
                <AccordionSummary
                  expandIcon={<BsCaretDown color="#FFF" />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                  sx={{
                    fontWeight: "bold",
                    background: red["700"],
                    color: "#FFF",
                  }}
                >
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    width={"100%"}
                    pr={2}
                  >
                    <Typography>SAQUES</Typography>
                    <Typography fontWeight={"bold"}>
                      {formatCurrency(
                        calcMovimentValues(handleFindMoviments("withdraw"))
                      )}
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  {!handleFindMoviments("withdraw").length ? (
                    <EmptyBox label="Nenhuma informação encontrada" />
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Valor</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell sx={{ width: "20px" }}>Ações</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {handleFindMoviments("withdraw").map((mov) => (
                            <>
                              <TableRow
                                hover
                                key={mov.id}
                                sx={{ "& > *": { borderBottom: "0" } }}
                              >
                                <TableCell sx={{ borderBottom: 0 }}>
                                  {formatCurrency(mov.value)}
                                </TableCell>
                                <TableCell sx={{ borderBottom: 0 }}>
                                  {formatDate(mov.created_at)}
                                </TableCell>
                                <TableCell
                                  sx={{ width: "20px", borderBottom: 0 }}
                                >
                                  <Stack direction={"row"} spacing={1}>
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() =>
                                        setOpenCollapse({
                                          movId: mov.id,
                                          open:
                                            openCollapse.movId === mov.id &&
                                            openCollapse.open
                                              ? false
                                              : true,
                                        })
                                      }
                                    >
                                      {openCollapse.movId === mov.id &&
                                      openCollapse.open ? (
                                        <FiChevronUp />
                                      ) : (
                                        <FiChevronDown />
                                      )}
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => deleteMoviment(mov.id)}
                                    >
                                      <HiOutlineTrash />
                                    </IconButton>
                                  </Stack>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  colSpan={3}
                                  style={{ paddingBottom: 0, paddingTop: 0 }}
                                >
                                  <Collapse
                                    in={
                                      openCollapse.movId === mov.id &&
                                      openCollapse.open
                                    }
                                  >
                                    <Box p={1}>
                                      <Typography
                                        color={grey["700"]}
                                        variant="body2"
                                      >
                                        {mov.description}
                                      </Typography>
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

                  <Button
                    startIcon={<AiOutlinePlus />}
                    sx={{ mt: 2 }}
                    onClick={() => handleOpenDrawer("withdraw")}
                  >
                    Adicionar Novo
                  </Button>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        )}
      </Container>

      <Drawer
        anchor={"right"}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Stack spacing={2} width={300} p={2}>
          <FormControl variant="filled">
            <InputLabel id="demo-simple-select-filled-label">
              Tipo de movimentação
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={moviment}
              onChange={(e) => setMoviment(e.target.value)}
            >
              <MenuItem value="">
                <em>Selcione</em>
              </MenuItem>
              <MenuItem value={"DEPOSIT"}>Depósito</MenuItem>
              <MenuItem value={"WITHDRAW"}>Saque</MenuItem>
            </Select>
          </FormControl>

          <InputText
            label="Valor (R$)"
            fullWidth
            value={currencyMask(value)}
            onChange={(e) => setValue(currencyMask(e.target.value))}
          />

          <InputText
            multiline
            rows={10}
            label="Descrição"
            value={description}
            onChange={(e) => setDescripion(e.target.value)}
          />

          <Button
            variant="contained"
            size="large"
            startIcon={<AiOutlineSave />}
            fullWidth
            onClick={saveCashierMoviment}
            loading={submitLoading}
          >
            Salvar
          </Button>
        </Stack>
      </Drawer>
    </Fragment>
  );
}
