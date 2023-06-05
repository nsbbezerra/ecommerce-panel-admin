import { Fragment, useEffect, useState } from "react";
import DefaultContainer from "../../components/layout/DefaultContainer";
import {
  Box,
  Checkbox,
  Chip,
  Divider,
  FilledInput,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import InputText from "../../components/layout/InputText";
import { AiOutlinePlus, AiOutlineSave } from "react-icons/ai";
import IconButton from "../../components/layout/IconButton";
import { blue, grey } from "@mui/material/colors";
import {
  ConfigsAlertProps,
  ConfigsProps,
  ConfigsRegionShipping,
} from "../../services/entities/configurations";
import shortid from "shortid";
import { FiTrash2 } from "react-icons/fi";
import Button from "../../components/layout/Button";
import Swal from "sweetalert2";
import { api } from "../../configs/api";
import getSuccessMessage from "../../helpers/getMessageSuccess";
import getErrorMessage from "../../helpers/getMessageError";
import Loading from "../../components/layout/Loading";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function AppConfigs() {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  const [countryFreeShipping, setCountryFreeShipping] = useState<string>("no");
  const [shippingMode, setShippingMode] = useState<string>("state");

  const handleChange = (event: SelectChangeEvent<typeof selectedStates>) => {
    const {
      target: { value },
    } = event;
    setSelectedStates(typeof value === "string" ? value.split(",") : value);
  };

  const [alerts, setAlerts] = useState<ConfigsAlertProps[]>([]);
  const [alertsForm, setAlertsForm] = useState<ConfigsAlertProps>({
    id: "",
    message: "",
    page: "",
  });

  const [region, setRegion] = useState<ConfigsRegionShipping[]>([]);
  const [regionForm, setRegionForm] = useState<ConfigsRegionShipping>({
    city: "",
    id: "",
    state: "",
  });

  const [isDark, setIsDark] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [getLoading, setGetLoadint] = useState<boolean>(false);

  function handleAddAlerts() {
    const filter = alerts.find((obj) => obj.page === alertsForm.page);

    if (!alertsForm.page.length) {
      Swal.fire({
        title: "Atenção",
        text: "Selecione uma página.",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }

    if (filter) {
      Swal.fire({
        title: "Atenção",
        text: "Já existe uma mensagem configurada para esta página.",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }

    if (!alertsForm.message.length) {
      Swal.fire({
        title: "Atenção",
        text: "Insira uma mensagem.",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }

    setAlerts([
      ...alerts,
      {
        id: shortid.generate(),
        message: alertsForm.message,
        page: alertsForm.page,
      },
    ]);

    setAlertsForm({
      id: "",
      message: "",
      page: "",
    });
  }

  function handleDeleteAlert(id: string) {
    const results = alerts.filter((obj) => obj.id !== id);
    setAlerts(results);
  }

  function handleAddRegion() {
    const filter = region.find(
      (obj) => obj.city === regionForm.city && obj.state === regionForm.state
    );

    if (filter) {
      Swal.fire({
        title: "Atenção",
        text: "Esta região já está configurada.",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }

    if (!regionForm.city.length) {
      Swal.fire({
        title: "Atenção",
        text: "Insira uma cidade.",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }

    if (!regionForm.state.length) {
      Swal.fire({
        title: "Atenção",
        text: "Selecione um estado.",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }

    setRegion([
      ...region,
      {
        city: regionForm.city,
        state: regionForm.state,
        id: shortid.generate(),
      },
    ]);

    setRegionForm({
      id: "",
      city: "",
      state: "",
    });
  }

  function handleDeleteRegion(id: string) {
    const results = region.filter((obj) => obj.id !== id);
    setRegion(results);
  }

  function saveConfiguration() {
    setIsLoading(true);
    api
      .post("/configurations/manage", {
        configuration: {
          app: {
            alerts,
            country_shipping: countryFreeShipping,
            shipping_mode: shippingMode,
            selected_state: selectedStates,
            regions: region,
            dark_mode: isDark,
          },
        },
      })
      .then((response) => {
        getSuccessMessage({ message: response.data.message });
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        getErrorMessage({ error });
      });
  }

  function getConfigurations() {
    setGetLoadint(true);
    api
      .get("/configurations")
      .then((response) => {
        setGetLoadint(false);
        const configurations: ConfigsProps | null = response.data.app;

        if (configurations) {
          setAlerts(configurations.alerts);
          setCountryFreeShipping(configurations.country_shipping);
          setIsDark(configurations.dark_mode);
          setShippingMode(configurations.shipping_mode);
          setRegion(configurations.regions);
          setSelectedStates(configurations.selected_state);
        }
      })
      .catch((error) => {
        setGetLoadint(false);
        getErrorMessage({ error });
      });
  }

  useEffect(() => {
    getConfigurations();
  }, []);

  return (
    <Fragment>
      <DefaultContainer disabledPadding>
        {getLoading ? (
          <Loading />
        ) : (
          <Stack spacing={2}>
            <Divider>
              <Chip size="small" label="Alertas do Site" />
            </Divider>

            <Stack spacing={2}>
              {alerts.map((alert) => (
                <Stack
                  direction={"row"}
                  gap={2}
                  flexWrap={"wrap"}
                  alignItems={"center"}
                  key={alert.id}
                >
                  <Box flexShrink={0}>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteAlert(alert.id)}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </Box>
                  <FormControl sx={{ flex: 1 }} size="small" variant="filled">
                    <InputLabel id="select-alert">Página</InputLabel>
                    <Select
                      labelId="select-alert"
                      id="demo-simple-select"
                      label="Página"
                      value={alert.page}
                      readOnly={true}
                    >
                      <MenuItem value={""}>
                        <em>Selecione</em>
                      </MenuItem>
                      <MenuItem value={"index"}>Inicial</MenuItem>
                      <MenuItem value={"products"}>Produtos</MenuItem>
                      <MenuItem value={"checkout"}>Pagamentos</MenuItem>
                      <MenuItem value={"customer"}>Cliente</MenuItem>
                    </Select>
                  </FormControl>

                  <InputText
                    fullWidth
                    label="Mensagem"
                    sx={{ flex: 2 }}
                    value={alert.message}
                    InputProps={{ readOnly: true }}
                  />
                </Stack>
              ))}
              <Stack
                direction={"row"}
                gap={2}
                flexWrap={"wrap"}
                alignItems={"center"}
              >
                <Box flexShrink={0}>
                  <IconButton color="primary" onClick={handleAddAlerts}>
                    <AiOutlinePlus />
                  </IconButton>
                </Box>
                <FormControl sx={{ flex: 1 }} size="small" variant="filled">
                  <InputLabel id="select-alert">Página</InputLabel>
                  <Select
                    labelId="select-alert"
                    id="demo-simple-select"
                    label="Página"
                    value={alertsForm.page}
                    onChange={(e) =>
                      setAlertsForm({ ...alertsForm, page: e.target.value })
                    }
                  >
                    <MenuItem value={""}>
                      <em>Selecione</em>
                    </MenuItem>
                    <MenuItem value={"index"}>Inicial</MenuItem>
                    <MenuItem value={"products"}>Produtos</MenuItem>
                    <MenuItem value={"checkout"}>Pagamentos</MenuItem>
                    <MenuItem value={"customer"}>Cliente</MenuItem>
                  </Select>
                </FormControl>

                <InputText
                  fullWidth
                  label="Mensagem"
                  sx={{ flex: 2 }}
                  value={alertsForm.message}
                  onChange={(e) =>
                    setAlertsForm({ ...alertsForm, message: e.target.value })
                  }
                />
              </Stack>
            </Stack>

            <Divider>
              <Chip size="small" label="Frete" />
            </Divider>

            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Frete grátis para todo o Brasil?
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={countryFreeShipping}
                      onChange={(e) => setCountryFreeShipping(e.target.value)}
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Sim"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="Não"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormControl disabled={countryFreeShipping === "yes"}>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Modo de frete
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={shippingMode}
                      onChange={(e) => setShippingMode(e.target.value)}
                    >
                      <FormControlLabel
                        value="state"
                        control={<Radio />}
                        label="Por Estado"
                      />
                      <FormControlLabel
                        value="region"
                        control={<Radio />}
                        label="Por Região"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {shippingMode === "state" && countryFreeShipping === "no" ? (
                  <Grid item xs={12}>
                    <FormControl variant="filled" fullWidth>
                      <InputLabel id="demo-multiple-checkbox-label">
                        Frete grátis por Estado
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={selectedStates}
                        onChange={handleChange}
                        input={<FilledInput />}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                      >
                        <MenuItem value="AC" sx={{ height: 40 }}>
                          <Checkbox
                            checked={selectedStates.indexOf("AC") > -1}
                          />
                          <ListItemText primary={"AC"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="AL">
                          <Checkbox
                            checked={selectedStates.indexOf("AL") > -1}
                          />
                          <ListItemText primary={"AL"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="AP">
                          <Checkbox
                            checked={selectedStates.indexOf("AP") > -1}
                          />
                          <ListItemText primary={"AP"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="AM">
                          <Checkbox
                            checked={selectedStates.indexOf("AM") > -1}
                          />
                          <ListItemText primary={"AM"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="BA">
                          <Checkbox
                            checked={selectedStates.indexOf("BA") > -1}
                          />
                          <ListItemText primary={"BA"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="CE">
                          <Checkbox
                            checked={selectedStates.indexOf("CE") > -1}
                          />
                          <ListItemText primary={"CE"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="DF">
                          <Checkbox
                            checked={selectedStates.indexOf("DF") > -1}
                          />
                          <ListItemText primary={"DF"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="ES">
                          <Checkbox
                            checked={selectedStates.indexOf("ES") > -1}
                          />
                          <ListItemText primary={"ES"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="GO">
                          <Checkbox
                            checked={selectedStates.indexOf("GO") > -1}
                          />
                          <ListItemText primary={"GO"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="MA">
                          <Checkbox
                            checked={selectedStates.indexOf("MA") > -1}
                          />
                          <ListItemText primary={"MA"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="MT">
                          <Checkbox
                            checked={selectedStates.indexOf("MT") > -1}
                          />
                          <ListItemText primary={"MT"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="MS">
                          <Checkbox
                            checked={selectedStates.indexOf("MS") > -1}
                          />
                          <ListItemText primary={"MS"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="MG">
                          <Checkbox
                            checked={selectedStates.indexOf("MG") > -1}
                          />
                          <ListItemText primary={"MG"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="PA">
                          <Checkbox
                            checked={selectedStates.indexOf("PA") > -1}
                          />
                          <ListItemText primary={"PA"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="PB">
                          <Checkbox
                            checked={selectedStates.indexOf("PB") > -1}
                          />
                          <ListItemText primary={"PB"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="PR">
                          <Checkbox
                            checked={selectedStates.indexOf("PR") > -1}
                          />
                          <ListItemText primary={"PR"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="PE">
                          <Checkbox
                            checked={selectedStates.indexOf("PE") > -1}
                          />
                          <ListItemText primary={"PE"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="PI">
                          <Checkbox
                            checked={selectedStates.indexOf("PI") > -1}
                          />
                          <ListItemText primary={"PI"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="RJ">
                          <Checkbox
                            checked={selectedStates.indexOf("RJ") > -1}
                          />
                          <ListItemText primary={"RJ"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="RN">
                          <Checkbox
                            checked={selectedStates.indexOf("RN") > -1}
                          />
                          <ListItemText primary={"RN"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="RS">
                          <Checkbox
                            checked={selectedStates.indexOf("RS") > -1}
                          />
                          <ListItemText primary={"RS"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="RO">
                          <Checkbox
                            checked={selectedStates.indexOf("RO") > -1}
                          />
                          <ListItemText primary={"RO"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="RR">
                          <Checkbox
                            checked={selectedStates.indexOf("RR") > -1}
                          />
                          <ListItemText primary={"RR"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="SC">
                          <Checkbox
                            checked={selectedStates.indexOf("SC") > -1}
                          />
                          <ListItemText primary={"SC"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="SP">
                          <Checkbox
                            checked={selectedStates.indexOf("SP") > -1}
                          />
                          <ListItemText primary={"SP"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="SE">
                          <Checkbox
                            checked={selectedStates.indexOf("SE") > -1}
                          />
                          <ListItemText primary={"SE"} />
                        </MenuItem>
                        <MenuItem sx={{ height: 40 }} value="TO">
                          <Checkbox
                            checked={selectedStates.indexOf("TO") > -1}
                          />
                          <ListItemText primary={"TO"} />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                ) : (
                  ""
                )}
              </Grid>
            </Box>

            {shippingMode === "region" && countryFreeShipping === "no" ? (
              <Box>
                <Typography color={grey["700"]} sx={{ mb: 1 }}>
                  Frete grátis por Região
                </Typography>

                <Stack spacing={1}>
                  {region.map((reg) => (
                    <Stack
                      direction={"row"}
                      gap={2}
                      flexWrap={"wrap"}
                      alignItems={"center"}
                      key={reg.id}
                    >
                      <Box flexShrink={0}>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteRegion(reg.id)}
                        >
                          <FiTrash2 />
                        </IconButton>
                      </Box>

                      <InputText
                        fullWidth
                        label="Cidade"
                        sx={{ flex: 2 }}
                        value={reg.city}
                        InputProps={{ readOnly: true }}
                      />
                      <FormControl
                        fullWidth
                        sx={{ flex: 1 }}
                        size="small"
                        variant="filled"
                      >
                        <InputLabel id="demo-simple-select-label">
                          Estado
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Age"
                          name="state"
                          value={reg.state}
                          readOnly={true}
                        >
                          <MenuItem value="">
                            <em>Selecione</em>
                          </MenuItem>
                          <MenuItem value="AC">AC</MenuItem>
                          <MenuItem value="AL">AL</MenuItem>
                          <MenuItem value="AP">AP</MenuItem>
                          <MenuItem value="AM">AM</MenuItem>
                          <MenuItem value="BA">BA</MenuItem>
                          <MenuItem value="CE">CE</MenuItem>
                          <MenuItem value="DF">DF</MenuItem>
                          <MenuItem value="ES">ES</MenuItem>
                          <MenuItem value="GO">GO</MenuItem>
                          <MenuItem value="MA">MA</MenuItem>
                          <MenuItem value="MT">MT</MenuItem>
                          <MenuItem value="MS">MS</MenuItem>
                          <MenuItem value="MG">MG</MenuItem>
                          <MenuItem value="PA">PA</MenuItem>
                          <MenuItem value="PB">PB</MenuItem>
                          <MenuItem value="PR">PR</MenuItem>
                          <MenuItem value="PE">PE</MenuItem>
                          <MenuItem value="PI">PI</MenuItem>
                          <MenuItem value="RJ">RJ</MenuItem>
                          <MenuItem value="RN">RN</MenuItem>
                          <MenuItem value="RS">RS</MenuItem>
                          <MenuItem value="RO">RO</MenuItem>
                          <MenuItem value="RR">RR</MenuItem>
                          <MenuItem value="SC">SC</MenuItem>
                          <MenuItem value="SP">SP</MenuItem>
                          <MenuItem value="SE">SE</MenuItem>
                          <MenuItem value="TO">TO</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  ))}
                </Stack>

                <Stack
                  direction={"row"}
                  gap={2}
                  flexWrap={"wrap"}
                  alignItems={"center"}
                  mt={1}
                >
                  <Box flexShrink={0}>
                    <IconButton color="primary" onClick={handleAddRegion}>
                      <AiOutlinePlus />
                    </IconButton>
                  </Box>

                  <InputText
                    fullWidth
                    label="Cidade"
                    sx={{ flex: 2 }}
                    value={regionForm.city}
                    onChange={(e) =>
                      setRegionForm({ ...regionForm, city: e.target.value })
                    }
                  />
                  <FormControl
                    fullWidth
                    sx={{ flex: 1 }}
                    size="small"
                    variant="filled"
                  >
                    <InputLabel id="demo-simple-select-label">
                      Estado
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Age"
                      name="state"
                      value={regionForm.state}
                      onChange={(e) =>
                        setRegionForm({ ...regionForm, state: e.target.value })
                      }
                    >
                      <MenuItem value="">
                        <em>Selecione</em>
                      </MenuItem>
                      <MenuItem value="AC">AC</MenuItem>
                      <MenuItem value="AL">AL</MenuItem>
                      <MenuItem value="AP">AP</MenuItem>
                      <MenuItem value="AM">AM</MenuItem>
                      <MenuItem value="BA">BA</MenuItem>
                      <MenuItem value="CE">CE</MenuItem>
                      <MenuItem value="DF">DF</MenuItem>
                      <MenuItem value="ES">ES</MenuItem>
                      <MenuItem value="GO">GO</MenuItem>
                      <MenuItem value="MA">MA</MenuItem>
                      <MenuItem value="MT">MT</MenuItem>
                      <MenuItem value="MS">MS</MenuItem>
                      <MenuItem value="MG">MG</MenuItem>
                      <MenuItem value="PA">PA</MenuItem>
                      <MenuItem value="PB">PB</MenuItem>
                      <MenuItem value="PR">PR</MenuItem>
                      <MenuItem value="PE">PE</MenuItem>
                      <MenuItem value="PI">PI</MenuItem>
                      <MenuItem value="RJ">RJ</MenuItem>
                      <MenuItem value="RN">RN</MenuItem>
                      <MenuItem value="RS">RS</MenuItem>
                      <MenuItem value="RO">RO</MenuItem>
                      <MenuItem value="RR">RR</MenuItem>
                      <MenuItem value="SC">SC</MenuItem>
                      <MenuItem value="SP">SP</MenuItem>
                      <MenuItem value="SE">SE</MenuItem>
                      <MenuItem value="TO">TO</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Box>
            ) : (
              ""
            )}

            <Divider>
              <Chip size="small" label="Mudar tema do Site" />
            </Divider>

            <FormControl component="fieldset" variant="standard">
              <FormLabel component="legend">Tema padrão do site</FormLabel>
              <FormGroup>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Claro</Typography>
                  <Switch
                    checked={isDark}
                    onChange={(e) => setIsDark(e.target.checked)}
                  />
                  <Typography>Escuro</Typography>
                </Stack>
              </FormGroup>
            </FormControl>

            <Divider />

            <Stack alignItems={"end"}>
              <Button
                variant="contained"
                startIcon={<AiOutlineSave />}
                size="large"
                loading={isLoading}
                onClick={saveConfiguration}
              >
                Salvar
              </Button>
            </Stack>
          </Stack>
        )}
      </DefaultContainer>
    </Fragment>
  );
}
