import { Fragment, MouseEvent, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import {
  Box,
  Card,
  Checkbox,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { FaDollarSign } from "react-icons/fa";

import Mp from "../../assets/mp.svg";
import Stripe from "../../assets/stripe.svg";
import Cielo from "../../assets/cielo.svg";
import { PaymentButton } from "./styles";
import { BsCheckCircle } from "react-icons/bs";
import InputText from "../../components/layout/InputText";
import Switch from "../../components/layout/Switch";
import Button from "../../components/layout/Button";
import { AiOutlineSave } from "react-icons/ai";

export default function Configurations() {
  const [alignment, setAlignment] = useState("app");

  const [payment, setPayment] = useState<"mp" | "cielo" | "stripe" | null>(
    "cielo"
  );

  const handleChange = (
    event: MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

  const FormPaymentMethod = () => (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Grid spacing={2} container>
        <Grid item xs={12} md={4}>
          <InputText label="Chave da API" fullWidth />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl variant="filled" size="small" fullWidth>
            <InputLabel id="demo-simple-select-filled-label">
              Parcelamento
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
            >
              <MenuItem value="">
                <em>Selecione</em>
              </MenuItem>
              <MenuItem value={1}>1x</MenuItem>
              <MenuItem value={2}>2x</MenuItem>
              <MenuItem value={3}>3x</MenuItem>
              <MenuItem value={4}>4x</MenuItem>
              <MenuItem value={5}>5x</MenuItem>
              <MenuItem value={6}>6x</MenuItem>
              <MenuItem value={7}>7x</MenuItem>
              <MenuItem value={8}>8x</MenuItem>
              <MenuItem value={9}>9x</MenuItem>
              <MenuItem value={10}>10x</MenuItem>
              <MenuItem value={11}>11x</MenuItem>
              <MenuItem value={12}>12x</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl variant="filled" size="small" fullWidth>
            <InputLabel id="demo-simple-select-filled-label">
              Parcelamento em juros
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
            >
              <MenuItem value="">
                <em>Selecione</em>
              </MenuItem>
              <MenuItem value={1}>1x</MenuItem>
              <MenuItem value={2}>2x</MenuItem>
              <MenuItem value={3}>3x</MenuItem>
              <MenuItem value={4}>4x</MenuItem>
              <MenuItem value={5}>5x</MenuItem>
              <MenuItem value={6}>6x</MenuItem>
              <MenuItem value={7}>7x</MenuItem>
              <MenuItem value={8}>8x</MenuItem>
              <MenuItem value={9}>9x</MenuItem>
              <MenuItem value={10}>10x</MenuItem>
              <MenuItem value={11}>11x</MenuItem>
              <MenuItem value={12}>12x</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel control={<Switch />} label="PIX" />
            <FormControlLabel control={<Switch />} label="Cartão de Crédito" />
            <FormControlLabel control={<Switch />} label="Boleto" />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <Link
            href={
              (payment === "mp" &&
                "https://www.mercadopago.com.br/ajuda/custo-receber-pagamentos_220") ||
              (payment === "cielo" && "https://www.cielo.com.br/e-commerce/") ||
              (payment === "stripe" && "https://stripe.com/br/pricing") ||
              "#"
            }
            target="_blank"
            underline="hover"
          >
            Veja as taxas deste método de pagamento
          </Link>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Box display={"flex"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox />}
            label="Concordo em usar este gateway"
          />
        </FormGroup>
        <Button startIcon={<AiOutlineSave />} variant="contained" size="large">
          Salvar
        </Button>
      </Box>
    </Card>
  );

  return (
    <Fragment>
      <AppBar title="Configurações" />

      <Container>
        <Box mb={-2}>
          <DefaultContainer>
            <ToggleButtonGroup
              color="primary"
              value={alignment}
              exclusive
              onChange={handleChange}
              aria-label="Platform"
            >
              <ToggleButton value="app">Aplicativo</ToggleButton>
              <ToggleButton value="payment">Pagamentos</ToggleButton>
            </ToggleButtonGroup>
          </DefaultContainer>
        </Box>

        <DefaultContainer>
          {alignment === "payment" && (
            <Fragment>
              <Box display={"flex"} alignItems={"center"} gap={2}>
                <FaDollarSign />
                <Typography variant="subtitle2" fontWeight={"500"}>
                  Selecione um gateway de pagamentos
                </Typography>
              </Box>
              <Divider sx={{ mt: 1, mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <PaymentButton
                    isActive={payment === "mp"}
                    onClick={
                      payment !== "mp" ? () => setPayment("mp") : () => {}
                    }
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
                      payment !== "stripe"
                        ? () => setPayment("stripe")
                        : () => {}
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
                  <FormPaymentMethod />
                </Grid>
              </Grid>
            </Fragment>
          )}
        </DefaultContainer>
      </Container>
    </Fragment>
  );
}
