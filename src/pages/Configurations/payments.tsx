import {
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { PaymentButton } from "./styles";
import Button from "../../components/layout/Button";
import { AiOutlineSave } from "react-icons/ai";

import Mp from "../../assets/mp.svg";
import Stripe from "../../assets/stripe.svg";
import Cielo from "../../assets/cielo.svg";
import { blue } from "@mui/material/colors";
import { FiExternalLink } from "react-icons/fi";
import { ConfigurationsEntity } from "../../services/entities/configurations";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import Loading from "../../components/layout/Loading";
import DefaultContainer from "../../components/layout/DefaultContainer";
import Swal from "sweetalert2";
import getSuccessMessage from "../../helpers/getMessageSuccess";
import Password from "../../components/layout/Password";

interface PaymentOnlineProps {
  gateway: string;
  api_key: string;
}

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

export default function PaymentsConfigsPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [payment, setPayment] = useState<string | null>(null);

  const [paymentLocalForm, setPaymentLocalForm] = useState<LocalPaymentProps>({
    check: false,
    credit_card: false,
    max_installments: "",
    money: false,
    pix: false,
    ticket: false,
    trade_note: false,
    debit_card: false,
  });

  const [paymentOnlineForm, setPaymentOnlineForm] =
    useState<PaymentOnlineProps>({
      api_key: "",
      gateway: "",
    });

  function getConfigurations() {
    setIsLoading(true);
    api
      .get("/configurations")
      .then((response) => {
        console.log(response.data);
        setIsLoading(false);
        const configuration: ConfigurationsEntity | null = response.data;

        setPaymentLocalForm({
          check: configuration?.payment_local?.check || false,
          credit_card: configuration?.payment_local?.credit_card || false,
          debit_card: configuration?.payment_local?.debit_card || false,
          max_installments:
            configuration?.payment_local?.max_installments || "",
          money: configuration?.payment_local?.money || false,
          pix: configuration?.payment_local?.pix || false,
          ticket: configuration?.payment_local?.ticket || false,
          trade_note: configuration?.payment_local?.trade_note || false,
        });

        setPaymentOnlineForm({
          api_key: configuration?.payment_online?.api_key || "",
          gateway: configuration?.payment_online?.gateway || "",
        });

        const paymentMode: string | null =
          configuration?.payment_online?.gateway || null;

        setPayment(paymentMode);
      })
      .catch((error) => {
        setIsLoading(false);
        getErrorMessage({ error });
      });
  }

  function saveConfiguration() {
    if (payment && !paymentOnlineForm.api_key.length) {
      Swal.fire({
        title: "Atenção",
        text: "Insira a chave de acesso ao gateway de pagamento",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }

    if (!paymentLocalForm.max_installments.toString().length) {
      Swal.fire({
        title: "Atenção",
        text: "Selecione uma quantidade máxima para o parcelamento",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    setIsSubmitLoading(true);

    api
      .post("/configurations/manage", {
        configuration: {
          payment_online: {
            gateway: payment,
            api_key: paymentOnlineForm.api_key,
          },
          payment_local: paymentLocalForm,
        },
      })
      .then((response) => {
        getSuccessMessage({ message: response.data.message });
        setIsSubmitLoading(false);
        getConfigurations();
      })
      .catch((error) => {
        setIsSubmitLoading(false);
        getErrorMessage({ error });
      });
  }

  useEffect(() => {
    getConfigurations();
  }, []);

  return (
    <DefaultContainer>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Divider sx={{ mb: 2 }}>
            <Chip label="Pagamentos Online" />
          </Divider>
          <Fragment>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <PaymentButton
                  isActive={payment === "mp"}
                  onClick={payment !== "mp" ? () => setPayment("mp") : () => {}}
                >
                  <img draggable={false} src={Mp} />

                  {payment === "mp" && (
                    <div className="flag">
                      <BsCheckCircle className="check-icon" />
                    </div>
                  )}
                </PaymentButton>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <PaymentButton
                  isActive={payment === "stripe"}
                  onClick={
                    payment !== "stripe" ? () => setPayment("stripe") : () => {}
                  }
                >
                  <img draggable={false} src={Stripe} />
                  {payment === "stripe" && (
                    <div className="flag">
                      <BsCheckCircle className="check-icon" />
                    </div>
                  )}
                </PaymentButton>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <PaymentButton
                  isActive={payment === "cielo"}
                  onClick={
                    payment !== "cielo" ? () => setPayment("cielo") : () => {}
                  }
                >
                  <img draggable={false} src={Cielo} />
                  {payment === "cielo" && (
                    <div className="flag">
                      <BsCheckCircle className="check-icon" />
                    </div>
                  )}
                </PaymentButton>
              </Grid>

              <Grid item xs={12}>
                <Grid spacing={2} container justifyContent={"flex-end"}>
                  <Grid item xs={12}>
                    <Password
                      label="Chave da API"
                      value={paymentOnlineForm.api_key}
                      onChange={(e) =>
                        setPaymentOnlineForm({
                          ...paymentOnlineForm,
                          api_key: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  {payment && (
                    <Grid item xs={12}>
                      <Link
                        href={
                          (payment === "mp" &&
                            "https://www.mercadopago.com.br/ajuda/custo-receber-pagamentos_220") ||
                          (payment === "cielo" &&
                            "https://www.cielo.com.br/e-commerce/") ||
                          (payment === "stripe" &&
                            "https://stripe.com/br/pricing#pricing-details") ||
                          "#"
                        }
                        target="_blank"
                        underline="hover"
                      >
                        Veja as taxas deste método de pagamento{" "}
                        <FiExternalLink />
                      </Link>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Fragment>
          <Divider sx={{ my: 2 }}>
            <Chip label="Pagamentos Local" />
          </Divider>

          <Grid container spacing={2} alignItems={"center"} mt={1}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <FormControl variant="filled" size="small" fullWidth>
                <InputLabel id="demo-simple-select-filled-label">
                  Parcelamento
                </InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  value={paymentLocalForm.max_installments}
                  onChange={(e) =>
                    setPaymentLocalForm({
                      ...paymentLocalForm,
                      max_installments: e.target.value,
                    })
                  }
                >
                  <MenuItem value="">
                    <em>Selecione</em>
                  </MenuItem>
                  <MenuItem value={"1"}>1x</MenuItem>
                  <MenuItem value={"2"}>2x</MenuItem>
                  <MenuItem value={"3"}>3x</MenuItem>
                  <MenuItem value={"4"}>4x</MenuItem>
                  <MenuItem value={"5"}>5x</MenuItem>
                  <MenuItem value={"6"}>6x</MenuItem>
                  <MenuItem value={"7"}>7x</MenuItem>
                  <MenuItem value={"8"}>8x</MenuItem>
                  <MenuItem value={"9"}>9x</MenuItem>
                  <MenuItem value={"10"}>10x</MenuItem>
                  <MenuItem value={"11"}>11x</MenuItem>
                  <MenuItem value={"12"}>12x</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={paymentLocalForm.money}
                      onChange={(e) =>
                        setPaymentLocalForm({
                          ...paymentLocalForm,
                          money: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Dinheiro"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={paymentLocalForm.pix}
                      onChange={(e) =>
                        setPaymentLocalForm({
                          ...paymentLocalForm,
                          pix: e.target.checked,
                        })
                      }
                    />
                  }
                  label="PIX"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={paymentLocalForm.credit_card}
                      onChange={(e) =>
                        setPaymentLocalForm({
                          ...paymentLocalForm,
                          credit_card: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Cartão de Crédito"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={paymentLocalForm.debit_card}
                      onChange={(e) =>
                        setPaymentLocalForm({
                          ...paymentLocalForm,
                          debit_card: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Cartão de Débito"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={paymentLocalForm.ticket}
                      onChange={(e) =>
                        setPaymentLocalForm({
                          ...paymentLocalForm,
                          ticket: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Boleto"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={paymentLocalForm.check}
                      onChange={(e) =>
                        setPaymentLocalForm({
                          ...paymentLocalForm,
                          check: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Cheque"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={paymentLocalForm.trade_note}
                      onChange={(e) =>
                        setPaymentLocalForm({
                          ...paymentLocalForm,
                          trade_note: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Duplicata"
                />
              </FormGroup>
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent={"flex-end"} mt={2}>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AiOutlineSave />}
                fullWidth
                loading={isSubmitLoading}
                onClick={saveConfiguration}
              >
                Salvar
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </DefaultContainer>
  );
}
