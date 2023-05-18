import {
  Box,
  Card,
  Chip,
  Collapse,
  Divider,
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
import { Fragment, memo, useEffect, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineCheck,
  AiOutlineClear,
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineTags,
} from "react-icons/ai";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ptBr from "date-fns/locale/pt-BR";
import InputText from "../../components/layout/InputText";
import Button from "../../components/layout/Button";
import subDays from "date-fns/subDays";
import DefaultContainer from "../../components/layout/DefaultContainer";
import Loading from "../../components/layout/Loading";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import formatCurrency from "../../helpers/formatCurrency";
import IconButton from "../../components/layout/IconButton";
import Tooltip from "../../components/layout/Tooltip";
import EmptyBox from "../../components/layout/EmptyBox";
import { GetOrderByIdEntity } from "../../services/entities/orders";
import Avatar from "../../components/layout/Avatar";
import { blue, grey } from "@mui/material/colors";
import { MenuContainer, MenuItem as StyledMenuItem } from "./styles";
import { FaSave, FaShoppingBag, FaShoppingCart } from "react-icons/fa";

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

const SalesSaved = () => {
  const navigate = useNavigate();

  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [search, setSearch] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);

  const [orders, setOrders] = useState<OrdersProps[]>([]);
  const [orderDetails, setOrderDetails] = useState<GetOrderByIdEntity | null>(
    null
  );

  const [openCollapse, setOpenCollapse] = useState<CollapseProps>({
    movId: "",
    open: false,
  });

  function getFinishedOrders() {
    setIsLoading(true);
    api
      .post("/orders/get-saved-orders", {
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

  function resetSearch() {
    setStartDate(subDays(new Date(), 30));
    setEndDate(new Date());
    setSearch("");
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

  useEffect(() => {
    getFinishedOrders();
  }, []);

  return (
    <Fragment>
      <AppBar title="Vendas Salvas" />
      <Container>
        <Stack p={2} spacing={2}>
          <MenuContainer>
            <StyledMenuItem
              active={false}
              onClick={() => navigate("/dashboard/vendas")}
            >
              <FaShoppingCart className="menu-icon" />
              <div className="menu-right">
                <span className="menu-title">BALCÃO</span>
                <span className="menu-desc">DE VENDAS</span>
              </div>
            </StyledMenuItem>
            <StyledMenuItem
              active={false}
              onClick={() => navigate("/dashboard/vendas/finalizadas")}
            >
              <FaShoppingBag className="menu-icon" />
              <div className="menu-right">
                <span className="menu-title">VENDAS</span>
                <span className="menu-desc">FINALIZADAS</span>
              </div>
            </StyledMenuItem>
            <StyledMenuItem active={true}>
              <FaSave className="menu-icon" />
              <div className="menu-right">
                <span className="menu-title">VENDAS</span>
                <span className="menu-desc">SALVAS</span>
              </div>
            </StyledMenuItem>
          </MenuContainer>

          <DefaultContainer disabledPadding>
            <Grid container spacing={2} alignItems={"center"}>
              <Grid item xs={12} sm={6} md={2}>
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
              <Grid item xs={12} sm={6} md={2}>
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
                  label="Busque por cliente ou Código"
                  fullWidth
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={5}>
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
                          <TableCell sx={{ width: "130px" }}>Origem</TableCell>
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
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() =>
                                      navigate(`/dashboard/vendas/${ord.id}`)
                                    }
                                  >
                                    <AiOutlineCheck />
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
    </Fragment>
  );
};

export default memo(SalesSaved);
