import { Fragment, useEffect, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import {
  Box,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Button from "../../components/layout/Button";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import {
  CashHandling,
  CashierEntity,
  Orders,
  OrdersCalc,
} from "../../services/entities/cashiers";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import DefaultContainer from "../../components/layout/DefaultContainer";
import Loading from "../../components/layout/Loading";
import { AiOutlineDollar, AiOutlineShoppingCart } from "react-icons/ai";
import { blue, green, grey, red } from "@mui/material/colors";
import handlePayForm from "../../helpers/handlePayForm";
import handlePaymentStatus from "../../helpers/hanldePaymentStatus";
import formatCurrency from "../../helpers/formatCurrency";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import EmptyBox from "../../components/layout/EmptyBox";

export default function CashierReport() {
  const navigate = useNavigate();

  const { cashier } = useParams();

  const [orders, setOrders] = useState<Orders[]>([]);
  const [ordersCalc, setOrdersCalc] = useState<OrdersCalc[]>([]);
  const [moviments, setMoviments] = useState<CashHandling[]>([]);
  const [cashierInfo, setCashierInfo] = useState<CashierEntity | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  function getCashierReport() {
    api
      .get(`/cashier/report/${cashier}`)
      .then((response) => {
        setOrders(response.data.orders);
        setOrdersCalc(response.data.ordersCalc);
        setMoviments(response.data.moviments);
        setCashierInfo(response.data.cashier);
        setIsLoading(false);
      })
      .catch((error) => {
        getErrorMessage({ error });
        setIsLoading(false);
      });
  }

  function calcMovimentValues(mov: CashHandling[]): number {
    return mov.reduce(
      (partialSum, a) => partialSum + parseFloat(a.value as string),
      0
    );
  }

  function calcOrders(mov: Orders[]): number {
    return mov.reduce(
      (partialSum, a) => partialSum + parseFloat(a.sub_total as string),
      0
    );
  }

  useEffect(() => {
    if (cashier) {
      getCashierReport();
    }
  }, [cashier]);

  return (
    <Fragment>
      <AppBar title="Resumo do Caixa" />
      <Container>
        <Box p={2}>
          <Stack spacing={2}>
            <Stack
              justifyContent={"space-between"}
              direction={"row"}
              gap={2}
              flexWrap={"wrap"}
            >
              <Box>
                <Button
                  startIcon={<FiChevronLeft />}
                  onClick={() => navigate("/dashboard/caixa")}
                >
                  Voltar
                </Button>
              </Box>
            </Stack>

            {isLoading ? (
              <DefaultContainer disabledPadding>
                <Loading />
              </DefaultContainer>
            ) : (
              <>
                <Box
                  borderRadius={"4px"}
                  boxShadow={"0px 0px 9px rgba(0, 0, 0, 0.05)"}
                  bgcolor={"#FFF"}
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
                    <AiOutlineShoppingCart />
                    <Typography variant="body2" fontWeight={"600"}>
                      VENDAS
                    </Typography>
                  </Stack>

                  {!orders.length ? (
                    <EmptyBox label="Nenhuma informação encontrada" />
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ minWidth: "120px" }}>
                              Cód.
                            </TableCell>
                            <TableCell sx={{ minWidth: "220px" }}>
                              Cliente
                            </TableCell>
                            <TableCell>Pagamento</TableCell>
                            <TableCell sx={{ textAlign: "right" }}>
                              Total
                            </TableCell>
                            <TableCell sx={{ textAlign: "right" }}>
                              Desconto
                            </TableCell>
                            <TableCell sx={{ textAlign: "right" }}>
                              Sub-Total
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id} hover>
                              <TableCell>{order.code}</TableCell>
                              <TableCell>{order.client.name}</TableCell>
                              <TableCell>
                                <Stack
                                  direction={"row"}
                                  spacing={1}
                                  alignItems={"center"}
                                >
                                  <Chip
                                    size="small"
                                    label={`${order.installments}x`}
                                  />
                                  <Chip
                                    size="small"
                                    label={handlePayForm(
                                      order.pay_form as string
                                    )}
                                    color={
                                      handlePaymentStatus(order.payment_status)
                                        .color
                                    }
                                  />
                                </Stack>
                              </TableCell>
                              <TableCell sx={{ textAlign: "right" }}>
                                {formatCurrency(order.total)}
                              </TableCell>
                              <TableCell sx={{ textAlign: "right" }}>
                                % {order.discount}
                              </TableCell>
                              <TableCell sx={{ textAlign: "right" }}>
                                {formatCurrency(order.sub_total)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    px={2}
                    py={1}
                    bgcolor={grey["300"]}
                  >
                    <Typography fontWeight={500}>TOTAL EM VENDAS</Typography>
                    <Typography fontWeight={500}>
                      {formatCurrency(calcOrders(orders))}
                    </Typography>
                  </Stack>
                </Box>

                <Box
                  borderRadius={"4px"}
                  boxShadow={"0px 0px 9px rgba(0, 0, 0, 0.05)"}
                  bgcolor={"#FFF"}
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
                    <AiOutlineDollar />
                    <Typography variant="body2" fontWeight={"600"}>
                      RESUMO POR FORMA DE PAGAMENTO
                    </Typography>
                  </Stack>

                  {!ordersCalc.length ? (
                    <EmptyBox label="Nenhuma informação encontrada" />
                  ) : (
                    <TableContainer sx={{ pb: 1 }}>
                      <Table>
                        <TableBody>
                          {ordersCalc.map((calc) => (
                            <TableRow hover>
                              <TableCell>
                                {handlePayForm(calc.pay_form as string)}
                              </TableCell>
                              <TableCell sx={{ textAlign: "right" }}>
                                {formatCurrency(calc._sum.sub_total as string)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>

                <Box
                  borderRadius={"4px"}
                  boxShadow={"0px 0px 9px rgba(0, 0, 0, 0.05)"}
                  bgcolor={"#FFF"}
                  overflow={"hidden"}
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
                    <Typography variant="body2" fontWeight={"600"}>
                      RETIRADAS
                    </Typography>
                  </Stack>

                  {!moviments.length ? (
                    <EmptyBox label="Nenhuma informação encontrada" />
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Descrição</TableCell>
                            <TableCell sx={{ textAlign: "right" }}>
                              Valor
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {moviments
                            .filter((obj) => obj.type === "WITHDRAW")
                            .map((mov) => (
                              <TableRow hover>
                                <TableCell>{mov.description}</TableCell>
                                <TableCell sx={{ textAlign: "right" }}>
                                  {formatCurrency(mov.value)}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    px={2}
                    py={1}
                    bgcolor={grey["300"]}
                  >
                    <Typography fontWeight={500}>TOTAL</Typography>
                    <Typography fontWeight={500}>
                      {formatCurrency(
                        calcMovimentValues(
                          moviments.filter((obj) => obj.type === "WITHDRAW")
                        )
                      )}
                    </Typography>
                  </Stack>
                </Box>

                <Box
                  borderRadius={"4px"}
                  boxShadow={"0px 0px 9px rgba(0, 0, 0, 0.05)"}
                  bgcolor={"#FFF"}
                  overflow={"hidden"}
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
                    <Typography variant="body2" fontWeight={"600"}>
                      DEPÓSITOS
                    </Typography>
                  </Stack>

                  {!moviments.length ? (
                    <EmptyBox label="Nenhuma informação encontrada" />
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Descrição</TableCell>
                            <TableCell sx={{ textAlign: "right" }}>
                              Valor
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {moviments
                            .filter((obj) => obj.type === "DEPOSIT")
                            .map((mov) => (
                              <TableRow hover>
                                <TableCell>{mov.description}</TableCell>
                                <TableCell sx={{ textAlign: "right" }}>
                                  {formatCurrency(mov.value)}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    px={2}
                    py={1}
                    bgcolor={grey["300"]}
                  >
                    <Typography fontWeight={500}>TOTAL</Typography>
                    <Typography fontWeight={500}>
                      {formatCurrency(
                        calcMovimentValues(
                          moviments.filter((obj) => obj.type === "DEPOSIT")
                        )
                      )}
                    </Typography>
                  </Stack>
                </Box>
              </>
            )}
          </Stack>
        </Box>
      </Container>
    </Fragment>
  );
}
