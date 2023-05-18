import { Fragment, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import {
  MenuItem as MUIMenuItem,
  FormControl,
  Grid,
  InputLabel,
  Select,
  Stack,
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from "@mui/material";
import { MenuContainer, MenuItem } from "../Pdv/styles";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { MdSsidChart } from "react-icons/md";
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import DefaultContainer from "../../components/layout/DefaultContainer";
import subDays from "date-fns/subDays";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ptBr from "date-fns/locale/pt-BR";
import Button from "../../components/layout/Button";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import { green, grey, red } from "@mui/material/colors";
import IconButton from "../../components/layout/IconButton";
import { PieChart, Pie, Cell } from "recharts";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
];
const COLORS = [green["700"], red["700"]];

export default function FinancialMovements() {
  const navigate = useNavigate();

  const [endDate, setEndDate] = useState<Date>(new Date());
  const [periodDate, setPeriodDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));

  return (
    <Fragment>
      <AppBar title="Movimentações Financeiras" />

      <Container>
        <Box p={2}>
          <MenuContainer>
            <MenuItem
              active={true}
              onClick={() => navigate("/dashboard/financeiro/movimentos")}
            >
              <MdSsidChart className="menu-icon" />
              <div className="menu-right">
                <span className="menu-title">GESTÃO DAS</span>
                <span className="menu-desc">MOVIMENTAÇÕES</span>
              </div>
            </MenuItem>
            <MenuItem
              active={false}
              onClick={() => navigate("/dashboard/financeiro/pagamentos")}
            >
              <GiReceiveMoney className="menu-icon" />
              <div className="menu-right">
                <span className="menu-title">GESTÃO</span>
                <span className="menu-desc">DE PAGAMENTOS</span>
              </div>
            </MenuItem>
            <MenuItem
              active={false}
              onClick={() => navigate("/dashboard/financeiro/relatorio")}
            >
              <BsFileEarmarkBarGraph className="menu-icon" />
              <div className="menu-right">
                <span className="menu-title">RELATÓRIO</span>
                <span className="menu-desc">FINANCEIRO</span>
              </div>
            </MenuItem>
          </MenuContainer>

          <Box mt={2}>
            <DefaultContainer disabledPadding>
              <Grid
                container
                spacing={2}
                alignItems={"center"}
                justifyContent={"end"}
              >
                <Grid item xs={12} sm={6} lg={2}>
                  <FormControl variant="filled" fullWidth size="small">
                    <InputLabel id="select-type-search">
                      Tipo de Busca
                    </InputLabel>
                    <Select
                      labelId="select-type-search"
                      id="select-type-search"
                    >
                      <MUIMenuItem value="">
                        <em>Selecione</em>
                      </MUIMenuItem>
                      <MUIMenuItem value={10}>Por Mês</MUIMenuItem>
                      <MUIMenuItem value={20}>Por Período</MUIMenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} lg={2.5}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={ptBr}
                  >
                    <DatePicker
                      label="Mês e Ano"
                      slotProps={{
                        textField: {
                          variant: "filled",
                          fullWidth: true,
                          size: "small",
                        },
                      }}
                      value={periodDate}
                      onChange={(e) => setPeriodDate(e as Date)}
                      views={["month", "year"]}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={6} lg={2.5}>
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

                <Grid item xs={12} sm={6} lg={2.5}>
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

                <Grid item xs={12} sm={6} lg={2.5}>
                  <Button
                    startIcon={<AiOutlineSearch />}
                    size="large"
                    variant="contained"
                    fullWidth
                  >
                    Buscar
                  </Button>
                </Grid>
              </Grid>
            </DefaultContainer>
          </Box>

          <Stack
            mt={2}
            gap={2}
            direction={"row"}
            justifyContent={"space-between"}
          >
            <Button
              variant="contained"
              startIcon={<AiOutlinePlus />}
              style={{ minWidth: "179px" }}
              fullWidth={false}
              onClick={() => navigate("/dashboard/financeiro/movimentos/criar")}
            >
              ADICIONAR NOVO
            </Button>
          </Stack>

          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={4}>
                <Box
                  bgcolor={green["700"]}
                  sx={{
                    boxShadow: "0px 0px 9px rgba(0, 0, 0, 0.05)",
                    borderRadius: "4px",
                  }}
                  px={2}
                  py={1}
                  color={"#fff"}
                >
                  <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <GiReceiveMoney
                      fontSize={"50px"}
                      style={{ flexShrink: 0 }}
                    />
                    <Box>
                      <Typography
                        variant="h5"
                        fontWeight={600}
                        lineHeight={"40px"}
                      >
                        R$ 1.000,00
                      </Typography>
                      <Typography variant="body2">
                        Total das Receitas
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box mt={2}>
                  <DefaultContainer disabledPadding>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Título</TableCell>
                            <TableCell>Valor</TableCell>
                            <TableCell>Vencimento</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow hover>
                            <TableCell>Título</TableCell>
                            <TableCell>R$ 100,00</TableCell>
                            <TableCell>10/10/1010</TableCell>
                            <TableCell>
                              <IconButton size="small" color="primary">
                                <AiOutlinePlus />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </DefaultContainer>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Box
                  bgcolor={red["700"]}
                  sx={{
                    boxShadow: "0px 0px 9px rgba(0, 0, 0, 0.05)",
                    borderRadius: "4px",
                  }}
                  px={2}
                  py={1}
                  color={"#fff"}
                >
                  <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <GiPayMoney fontSize={"50px"} style={{ flexShrink: 0 }} />
                    <Box>
                      <Typography
                        variant="h5"
                        fontWeight={600}
                        lineHeight={"40px"}
                      >
                        R$ 1.000,00
                      </Typography>
                      <Typography variant="body2">
                        Total das Despesas
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box mt={2}>
                  <DefaultContainer disabledPadding>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Título</TableCell>
                            <TableCell>Valor</TableCell>
                            <TableCell>Vencimento</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow hover>
                            <TableCell>Título</TableCell>
                            <TableCell>R$ 100,00</TableCell>
                            <TableCell>10/10/1010</TableCell>
                            <TableCell>
                              <IconButton size="small" color="primary">
                                <AiOutlinePlus />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </DefaultContainer>
                </Box>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Stack spacing={2}>
                  <DefaultContainer disabledPadding>
                    <Box display={"flex"} justifyContent={"center"}>
                      <PieChart width={200} height={200}>
                        <Pie
                          data={data}
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={false}
                        >
                          {data.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </Box>
                    <Stack direction={"row"} spacing={2}>
                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <Box
                          width={"20px"}
                          height={"20px"}
                          bgcolor={green["700"]}
                          borderRadius={"4px"}
                        />
                        <Typography
                          fontWeight={500}
                          color={grey["700"]}
                          variant="body2"
                        >
                          Receitas
                        </Typography>
                      </Stack>

                      <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                      >
                        <Box
                          width={"20px"}
                          height={"20px"}
                          bgcolor={red["700"]}
                          borderRadius={"4px"}
                        />
                        <Typography
                          fontWeight={500}
                          color={grey["700"]}
                          variant="body2"
                        >
                          Despesas
                        </Typography>
                      </Stack>
                    </Stack>
                  </DefaultContainer>

                  <DefaultContainer disabledPadding>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      color={red["700"]}
                    >
                      <Typography fontWeight={600}>Despesas</Typography>
                      <Typography fontWeight={600}>R$ 100,00</Typography>
                    </Stack>
                    <Divider sx={{ my: 1 }} />
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      color={green["700"]}
                    >
                      <Typography fontWeight={600}>Receitas</Typography>
                      <Typography fontWeight={600}>R$ 100,00</Typography>
                    </Stack>
                    <Divider sx={{ my: 1 }} />
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      color={grey["800"]}
                    >
                      <Typography fontWeight={600}>Saldo</Typography>
                      <Typography fontWeight={600}>R$ 100,00</Typography>
                    </Stack>
                  </DefaultContainer>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
}
