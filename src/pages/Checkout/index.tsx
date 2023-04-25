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
import { grey } from "@mui/material/colors";
import { BsCaretDown, BsPinMap } from "react-icons/bs";
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
import InputText from "../../components/layout/InputText";

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

  useEffect(() => {
    findConfigurations();
  }, []);

  useEffect(() => {
    if (order) {
      getOrderById();
    }
  }, [order]);

  return (
    <Fragment>
      <AppBar title="Checkout" />

      <Container size="lg">
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
                  <Grid item xs={12}>
                    <DefaultContainer disabledPadding>
                      <Typography variant="h6" color={grey["700"]}>
                        Compra: #{myOrder.id} -{" "}
                        {formatDate(new Date(myOrder.created_at))}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
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
                                <Box display={"flex"} flexDirection={"column"}>
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
                                        items.product_options?.headline || ""
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
                          <Typography>Você irá pagar usando:</Typography>
                          {configurations?.gateway === "mp" && (
                            <img src={Mp} style={{ maxWidth: "300px" }} />
                          )}
                          {configurations?.gateway === "stripe" && (
                            <img src={Stripe} style={{ maxWidth: "300px" }} />
                          )}
                          {configurations?.gateway === "cielo" && (
                            <img src={Cielo} style={{ maxWidth: "300px" }} />
                          )}
                          <Button
                            startIcon={<AiOutlineDollar />}
                            size="large"
                            variant="contained"
                          >
                            Pagar agora
                          </Button>
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
                          <Grid item xs={4}>
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
                              >
                                <MenuItem value="">
                                  <em>Selecione</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={4}>
                            <FormControl
                              variant="filled"
                              fullWidth
                              size="small"
                            >
                              <InputLabel id="demo-simple-select-label">
                                Parcelas
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                              >
                                <MenuItem value="">
                                  <em>Selecione</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={4}>
                            <Button
                              startIcon={<AiOutlineDollar />}
                              size="large"
                              variant="contained"
                              fullWidth
                            >
                              Pagar agora
                            </Button>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
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
