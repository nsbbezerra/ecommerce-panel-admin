import { Fragment } from "react";
import AppBar from "../../components/layout/AppBar";
import { useNavigate, useParams } from "react-router-dom";
import DefaultContainer from "../../components/layout/DefaultContainer";
import Container from "../../components/layout/Container";
import { Box, Stack, Typography } from "@mui/material";
import { HiBadgeCheck } from "react-icons/hi";
import { IoIosWarning } from "react-icons/io";
import { green, red, yellow } from "@mui/material/colors";
import { MdError } from "react-icons/md";
import Button from "../../components/layout/Button";
import EmptyBox from "../../components/layout/EmptyBox";

export default function FinishCheckout() {
  const { status } = useParams();

  const navigate = useNavigate();

  return (
    <Fragment>
      <AppBar title="Finalizar Checkout" />

      <Container size="md">
        <DefaultContainer>
          {!status ? (
            <EmptyBox label="Informações não encontradas!" />
          ) : (
            <>
              {status === "sucesso" && (
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={2}
                >
                  <HiBadgeCheck fontSize={100} color={green["500"]} />
                  <Typography
                    variant="h4"
                    fontWeight={"bold"}
                    color={green["500"]}
                  >
                    SUCESSO
                  </Typography>
                  <Typography>
                    Pagamento confirmado, esta compra está finalizada!
                  </Typography>

                  <Stack spacing={1}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      color="success"
                      onClick={() => navigate("/dashboard")}
                    >
                      Continuar nesta tela
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      color="primary"
                      onClick={() => window.close()}
                    >
                      Fechar esta tela
                    </Button>
                  </Stack>
                </Box>
              )}

              {status === "aguarde" && (
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={2}
                >
                  <IoIosWarning fontSize={100} color={yellow["700"]} />
                  <Typography
                    variant="h4"
                    fontWeight={"bold"}
                    color={yellow["700"]}
                  >
                    AGUARDE
                  </Typography>
                  <Typography>
                    Pagamento em processamento, venda em espera!
                  </Typography>

                  <Stack spacing={1}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      color="success"
                      onClick={() => navigate("/dashboard")}
                    >
                      Continuar nesta tela
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      color="primary"
                      onClick={() => window.close()}
                    >
                      Fechar esta tela
                    </Button>
                  </Stack>
                </Box>
              )}

              {status === "erro" && (
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={2}
                >
                  <MdError fontSize={100} color={red["600"]} />
                  <Typography
                    variant="h4"
                    fontWeight={"bold"}
                    color={red["600"]}
                  >
                    ERRO
                  </Typography>
                  <Typography>
                    Ocorreu um erro no pagamento, venda em espera!
                  </Typography>

                  <Stack spacing={1}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      color="success"
                      onClick={() => navigate("/dashboard")}
                    >
                      Continuar nesta tela
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      color="primary"
                      onClick={() => window.close()}
                    >
                      Fechar esta tela
                    </Button>
                  </Stack>
                </Box>
              )}
            </>
          )}
        </DefaultContainer>
      </Container>
    </Fragment>
  );
}
