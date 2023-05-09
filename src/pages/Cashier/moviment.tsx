import { Fragment, useEffect, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Collapse,
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
  AiOutlinePlus,
  AiOutlinePrinter,
  AiOutlineSave,
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
import { api } from "../../configs/api";
import getSuccessMessage from "../../helpers/getMessageSuccess";
import getErrorMessage from "../../helpers/getMessageError";
import currencyMask from "../../helpers/currencyMask";
import formatCurrency from "../../helpers/formatCurrency";

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

  const [orders, setOrders] = useState<OrdersProps[]>([]);

  const [cashHandlings, setCashHandlings] = useState<CashHandlingProps[]>([]);

  const [openCollapse, setOpenCollapse] = useState<CollapseProps>({
    movId: "",
    open: false,
  });

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
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(`/cashier/moviment/${id}`)
          .then((response) => {
            getSuccessMessage({ message: response.data.message });
            getCashierMoviment();
          })
          .catch((error) => getErrorMessage({ error }));
      }
    });
  }

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
                  <Button variant="contained" startIcon={<BsDoorClosed />}>
                    Fechar caixa
                  </Button>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <DefaultContainer disabledPadding>
                {orders.length === 0 ? (
                  <EmptyBox label="Nenhuma informação encontrada" />
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ minWidth: "240px" }}>
                            Cliente
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
                        <TableRow hover>
                          <TableCell>Natanael dos Santos Bezerra</TableCell>
                          <TableCell>00/00/0000</TableCell>
                          <TableCell sx={{ textAlign: "right" }}>
                            R$ 4000,00
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Stack direction={"row"} spacing={1}>
                              <IconButton color="primary" size="small">
                                <AiOutlinePrinter />
                              </IconButton>
                              <IconButton color="primary" size="small">
                                <AiOutlineCheck />
                              </IconButton>
                              <IconButton color="error" size="small">
                                <HiOutlineTrash />
                              </IconButton>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <IconButton color="primary" size="small">
                              <FiChevronDown />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </DefaultContainer>
            </Grid>

            <Grid item xs={12}>
              <DefaultContainer disabledPadding>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  flexWrap={"wrap"}
                  gap={1}
                  color={grey["700"]}
                >
                  <Typography variant="body1">
                    TOTAL DAS MOVIMENTAÇÕES
                  </Typography>
                  <Typography variant="body1" fontWeight={"bold"}>
                    {formatCurrency(
                      calcMovimentValues(handleFindMoviments("deposit")) -
                        calcMovimentValues(handleFindMoviments("withdraw"))
                    )}
                  </Typography>
                </Stack>
              </DefaultContainer>
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
                                <TableCell>
                                  {formatCurrency(mov.value)}
                                </TableCell>
                                <TableCell>
                                  {formatDate(mov.created_at)}
                                </TableCell>
                                <TableCell sx={{ width: "20px" }}>
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
                                <TableCell>
                                  {formatCurrency(mov.value)}
                                </TableCell>
                                <TableCell>
                                  {formatDate(mov.created_at)}
                                </TableCell>
                                <TableCell sx={{ width: "20px" }}>
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
