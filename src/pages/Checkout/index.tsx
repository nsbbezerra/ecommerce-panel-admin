import { Fragment, SyntheticEvent, useEffect, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import DefaultContainer from "../../components/layout/DefaultContainer";
import { blue, grey } from "@mui/material/colors";
import { BsCaretDown } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import EmptyBox from "../../components/layout/EmptyBox";
import Button from "../../components/layout/Button";
import { FiChevronLeft } from "react-icons/fi";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import { GetOrderByIdEntity } from "../../services/entities/orders";
import Avatar from "../../components/layout/Avatar";
import { AddressesEntity } from "../../services/entities/address";
import formatCurrency from "../../helpers/formatCurrency";

import Mp from "../../assets/mp.svg";
import Stripe from "../../assets/stripe.svg";
import Cielo from "../../assets/cielo.svg";
import { AiOutlineDollar } from "react-icons/ai";
import havePayFormInstallments from "../../helpers/havePayFormInstallments";
import Swal from "sweetalert2";

interface LocalPaymentProps {
  max_installments: number | string;
  money: boolean;
  pix: boolean;
  credit_card: boolean;
  debit_card: boolean;
  ticket: boolean;
  check: boolean;
  trade_note: boolean;
}

interface ConfigurationsProps {
  payment_local: LocalPaymentProps | undefined;
  gateway: string;
}

export default function Checkout() {
  const navigate = useNavigate();

  const { order } = useParams();

  const [myOrder, setMyorder] = useState<GetOrderByIdEntity | null>(null);

  const [expanded, setExpanded] = useState<string | false>(false);

  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);

  const [payForm, setPayForm] = useState<string>("");

  const [installments, setInstallments] = useState<number | string>("");

  const handleChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const [configurations, setConfigurations] = useState<
    ConfigurationsProps | undefined
  >(undefined);

  function findConfigurations() {
    api
      .get("/configurations/checkout")
      .then((response) => {
        setConfigurations({
          payment_local: response.data.payment_local,
          gateway: response.data.gateway,
        });
      })
      .catch((error) => getErrorMessage({ error }));
  }

  function getOrderById() {
    api
      .get(`/orders/get-by-id/${order}`)
      .then((response) => {
        setMyorder(response.data);
      })
      .catch((error) => {
        getErrorMessage({ error });
      });
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  }

  function getAddress(address: AddressesEntity | undefined) {
    if (!address) {
      return "Nenhum endereço cadastrado";
    } else {
      return `${address.street}, ${address.number}, ${address.district}, CEP: ${address.cep}, ${address.city} - ${address.state}`;
    }
  }

  function payOrder() {
    if (expanded === false || expanded === "" || !expanded.length) {
      Swal.fire({
        title: "Atenção",
        text: "Selecione um modo de pagamento: Online ou Local",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (expanded === "online") {
      setPaymentLoading(true);
      api
        .post("/payments/online", {
          gateway: configurations?.gateway || "",
          orderId: order,
          system: "pdv",
        })
        .then((response) => {
          setPaymentLoading(false);
          window.open(response.data.redirect, "_blank");
          navigate("/dashboard/vendas");
        })
        .catch((error) => {
          setPaymentLoading(false);
          getErrorMessage({ error });
        });
    }
    if (expanded === "local") {
      if (payForm === "") {
        Swal.fire({
          title: "Atenção",
          text: "Selecione uma forma de pagamento",
          icon: "warning",
          confirmButtonColor: blue["500"],
        });
        return;
      }
      setPaymentLoading(true);
      api
        .post("/payments/local", {
          payForm,
          orderId: order,
          installments: installments === "" ? 1 : installments,
        })
        .then((response) => {
          setPaymentLoading(false);
          Swal.fire({
            title: "Sucesso",
            text: response.data.message,
            icon: "success",
            confirmButtonColor: blue["500"],
          }).then((results) => {
            if (results.isConfirmed) {
              navigate("/dashboard/vendas");
            }
          });
        })
        .catch((error) => {
          setPaymentLoading(false);
          getErrorMessage({ error });
        });
    }
  }

  useEffect(() => {
    findConfigurations();
  }, []);

  useEffect(() => {
    if (order) {
      getOrderById();
    }
  }, [order]);

  useEffect(() => {
    const haveInstallments = havePayFormInstallments(payForm);
    if (!haveInstallments) {
      setInstallments("");
    }
  }, [payForm]);

  return (
    <Fragment>
      <AppBar title="Checkout" />

      <Container>
        {!order ? (
          <Box
            padding={"20px"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"flex-start"}
            gap={2}
          >
            <Button
              startIcon={<FiChevronLeft />}
              onClick={() => navigate("/dashboard/vendas")}
            >
              Voltar
            </Button>
            <DefaultContainer disabledPadding>
              <EmptyBox label="Compra não encontrada" />
            </DefaultContainer>
          </Box>
        ) : (
          <Box p={"20px"}>
            {!myOrder ? (
              <DefaultContainer disabledPadding>
                <EmptyBox label="Nenhuma informação para mostrar" />
              </DefaultContainer>
            ) : (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={7} lg={8}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <DefaultContainer disabledPadding>
                          <Typography variant="h6" color={grey["700"]}>
                            Compra: #{myOrder.id} -{" "}
                            {formatDate(new Date(myOrder.created_at))}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="h6">
                            {myOrder.client.name || ""}
                          </Typography>
                          <Typography variant="body2" color={"GrayText"} mt={1}>
                            {getAddress(myOrder.client.Addresses[0])}
                          </Typography>
                        </DefaultContainer>
                      </Grid>

                      <Grid item xs={12}>
                        <DefaultContainer disabledPadding>
                          <Stack spacing={3} padding={2}>
                            {myOrder.OrderItems.map((items, index, array) => (
                              <>
                                <Box
                                  key={items.id}
                                  display={"flex"}
                                  justifyContent={"space-between"}
                                  alignItems={"flex-start"}
                                  gap={2}
                                >
                                  <Stack direction={"row"} spacing={3}>
                                    <Avatar
                                      src={items.product.thumbnail || ""}
                                      sx={{ width: 60, height: 60 }}
                                    />
                                    <Box
                                      display={"flex"}
                                      flexDirection={"column"}
                                    >
                                      <Typography>
                                        {items.product.name || ""}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color={"GrayText"}
                                      >
                                        Categoria:{" "}
                                        {items.product.category.name || ""}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color={"GrayText"}
                                      >
                                        Sub-categoria:{" "}
                                        {items.product.collection.name || ""}
                                      </Typography>
                                      <Typography variant="caption">
                                        Quantidade: {items.quantity || ""}
                                      </Typography>
                                      {items.product_options && (
                                        <Chip
                                          label={`Opção: ${
                                            items.product_options?.headline ||
                                            ""
                                          }`}
                                          sx={{ width: "min-content" }}
                                        />
                                      )}
                                    </Box>
                                  </Stack>
                                  <Typography fontWeight={"500"}>
                                    {formatCurrency(items.price)}
                                  </Typography>
                                </Box>
                                {index + 1 !== array.length && <Divider />}
                              </>
                            ))}
                          </Stack>
                        </DefaultContainer>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={5} lg={4}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Accordion
                          elevation={0}
                          sx={{
                            boxShadow: "0px 0px 9px rgba(0, 0, 0, 0.05)",
                          }}
                          expanded={expanded === "online"}
                          onChange={handleChange("online")}
                        >
                          <AccordionSummary
                            expandIcon={<BsCaretDown />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography>Pagar Online</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Box
                              display={"flex"}
                              flexDirection={"column"}
                              gap={4}
                              justifyContent={"center"}
                              alignItems={"center"}
                            >
                              {configurations?.gateway === "mp" && (
                                <img src={Mp} style={{ maxWidth: "210px" }} />
                              )}
                              {configurations?.gateway === "stripe" && (
                                <img
                                  src={Stripe}
                                  style={{ maxWidth: "210px" }}
                                />
                              )}
                              {configurations?.gateway === "cielo" && (
                                <img
                                  src={Cielo}
                                  style={{ maxWidth: "210px" }}
                                />
                              )}
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                        <Accordion
                          elevation={0}
                          sx={{ boxShadow: "0px 0px 9px rgba(0, 0, 0, 0.05)" }}
                          expanded={expanded === "local"}
                          onChange={handleChange("local")}
                        >
                          <AccordionSummary
                            expandIcon={<BsCaretDown />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                          >
                            <Typography>Pagar Local</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid container spacing={2} alignItems={"center"}>
                              <Grid item xs={12}>
                                <FormControl
                                  variant="filled"
                                  fullWidth
                                  size="small"
                                >
                                  <InputLabel id="demo-simple-select-label">
                                    Forma de Pagamento
                                  </InputLabel>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={payForm}
                                    onChange={(e) => setPayForm(e.target.value)}
                                  >
                                    <MenuItem value="">
                                      <em>Selecione</em>
                                    </MenuItem>
                                    {configurations?.payment_local?.check && (
                                      <MenuItem value="check">Cheque</MenuItem>
                                    )}
                                    {configurations?.payment_local
                                      ?.credit_card && (
                                      <MenuItem value="credit_card">
                                        Cartão de crédito
                                      </MenuItem>
                                    )}
                                    {configurations?.payment_local
                                      ?.debit_card && (
                                      <MenuItem value="debit_card">
                                        Cartão de débito
                                      </MenuItem>
                                    )}
                                    {configurations?.payment_local?.money && (
                                      <MenuItem value="money">
                                        Dinheiro
                                      </MenuItem>
                                    )}
                                    {configurations?.payment_local?.pix && (
                                      <MenuItem value="pix">PIX</MenuItem>
                                    )}
                                    {configurations?.payment_local?.ticket && (
                                      <MenuItem value="ticket">Boleto</MenuItem>
                                    )}
                                    {configurations?.payment_local
                                      ?.trade_note && (
                                      <MenuItem value="trade_note">
                                        Duplicata
                                      </MenuItem>
                                    )}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12}>
                                <FormControl
                                  variant="filled"
                                  fullWidth
                                  size="small"
                                  disabled={
                                    payForm === "credit_card" ||
                                    payForm === "trade_note" ||
                                    payForm === "ticket"
                                      ? false
                                      : true
                                  }
                                >
                                  <InputLabel id="demo-simple-select-label">
                                    Parcelas
                                  </InputLabel>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={installments}
                                    onChange={(e) =>
                                      setInstallments(e.target.value)
                                    }
                                  >
                                    <MenuItem value="">
                                      <em>Selecione</em>
                                    </MenuItem>
                                    {[
                                      ...Array(
                                        Number(
                                          configurations?.payment_local
                                            ?.max_installments
                                        ) + 1 || 0
                                      ).keys(),
                                    ].map((opt, index) => {
                                      if (index > 0) {
                                        return (
                                          <MenuItem value={opt}>
                                            {opt}x de{" "}
                                            {formatCurrency(
                                              parseFloat(
                                                myOrder.sub_total as string
                                              ) / opt
                                            )}
                                          </MenuItem>
                                        );
                                      }
                                    })}
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      </Grid>
                      <Grid item xs={12}>
                        <DefaultContainer disabledPadding>
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                          >
                            <Typography fontWeight={"600"} variant="subtitle1">
                              Total
                            </Typography>
                            <Typography fontWeight={"600"} variant="subtitle1">
                              {formatCurrency(myOrder.total)}
                            </Typography>
                          </Box>
                          <Divider sx={{ my: 1 }} />
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                          >
                            <Typography fontWeight={"600"} variant="subtitle1">
                              Desconto
                            </Typography>
                            <Typography fontWeight={"600"} variant="subtitle1">
                              {myOrder.discount}%
                            </Typography>
                          </Box>
                          <Divider sx={{ my: 1 }} />
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                          >
                            <Typography fontWeight={"600"} variant="subtitle1">
                              Sub-Total
                            </Typography>
                            <Typography fontWeight={"600"} variant="subtitle1">
                              {formatCurrency(myOrder.sub_total)}
                            </Typography>
                          </Box>
                        </DefaultContainer>
                      </Grid>
                      <Grid item xs={12}>
                        <DefaultContainer disabledPadding>
                          <Button
                            startIcon={<AiOutlineDollar />}
                            size="large"
                            variant="contained"
                            loading={paymentLoading}
                            onClick={payOrder}
                            fullWidth
                          >
                            Processar pagamento
                          </Button>
                        </DefaultContainer>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        )}
      </Container>
    </Fragment>
  );
}
