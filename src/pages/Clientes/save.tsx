import {
  Box,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { ChangeEvent, FormEvent, Fragment, useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AppBar from "../../components/layout/AppBar";
import Button from "../../components/layout/Button";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import InputText from "../../components/layout/InputText";
import Password from "../../components/layout/Password";
import cepMask from "../../helpers/cepMask";
import documentMask from "../../helpers/documentMask";
import phoneMask from "../../helpers/phoneMask";
import { AddressDto } from "../../services/dto/address";
import { ClientsDto } from "../../services/dto/clients";
import { sha256 } from "js-sha256";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";

export default function SaveClient() {
  const navigate = useNavigate();

  const [clientsForm, setClientsForm] = useState<ClientsDto>({
    document: "",
    email: "",
    name: "",
    password: "",
    phone: "",
  });
  const [addressForm, setAddressForm] = useState<AddressDto>({
    cep: "",
    city: "",
    comp: "",
    default: true,
    district: "",
    number: "",
    state: "",
    street: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleChangeClientForm(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.name === "document") {
      setClientsForm((prev) => {
        return {
          ...prev,
          [event.target.name]: documentMask(event.target.value),
        };
      });
    }
    if (event.target.name === "phone") {
      setClientsForm((prev) => {
        return {
          ...prev,
          [event.target.name]: phoneMask(event.target.value),
        };
      });
    }
    setClientsForm((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  }
  function handleChangeAddressForm(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.name === "cep") {
      setAddressForm((prev) => {
        return {
          ...prev,
          [event.target.name]: cepMask(event.target.value),
        };
      });
    }
    setAddressForm((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  }

  function handleSaveClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!clientsForm.name.length) {
      Swal.fire({
        title: "Atenção",
        text: "O nome é obrigatório",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (!clientsForm.document.length) {
      Swal.fire({
        title: "Atenção",
        text: "O documento é obrigatório",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (!clientsForm.phone.length) {
      Swal.fire({
        title: "Atenção",
        text: "O telefone é obrigatório",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (!addressForm.street.length) {
      Swal.fire({
        title: "Atenção",
        text: "A rua é obrigatória",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (!addressForm.number.length) {
      Swal.fire({
        title: "Atenção",
        text: "O número é obrigatório",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (!addressForm.district.length) {
      Swal.fire({
        title: "Atenção",
        text: "O bairro é obrigatório",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (!addressForm.cep.length) {
      Swal.fire({
        title: "Atenção",
        text: "O CEP é obrigatório",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (!addressForm.city.length) {
      Swal.fire({
        title: "Atenção",
        text: "A cidade é obrigatória",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (!addressForm.state.length) {
      Swal.fire({
        title: "Atenção",
        text: "O estado é obrigatório",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    setIsLoading(true);
    api
      .post("/clients/save", {
        client: {
          name: clientsForm.name,
          document: clientsForm.document,
          phone: clientsForm.phone,
          email: clientsForm.email,
          password: sha256(clientsForm.password),
        },
      })
      .then((response) => {
        api
          .post("/addresses/save", {
            address: {
              client_id: response.data.id,
              ...addressForm,
            },
          })
          .then((res) => {
            setIsLoading(false);
            Swal.fire({
              title: "Sucesso",
              text: "Cadastro efetuado com sucesso",
              icon: "success",
              confirmButtonColor: blue["500"],
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/dashboard/clientes");
              }
            });
          })
          .catch((error) => {
            getErrorMessage({ error });
            setIsLoading(false);
          });
      })
      .catch((error) => {
        getErrorMessage({ error });
        setIsLoading(false);
      });
  }

  return (
    <Fragment>
      <AppBar title="Adicionar Cliente" />
      <Container>
        <Box padding={"20px"} mb={-2}>
          <Button
            startIcon={<FiChevronLeft />}
            onClick={() => navigate("/dashboard/clientes")}
          >
            Voltar
          </Button>
        </Box>
        <DefaultContainer>
          <form onSubmit={handleSaveClient}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={7} lg={8}>
                <InputText
                  label="Nome"
                  fullWidth
                  autoFocus
                  name="name"
                  value={clientsForm.name}
                  onChange={(e) =>
                    handleChangeClientForm(e as ChangeEvent<HTMLInputElement>)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={5} lg={4}>
                <InputText
                  fullWidth
                  label="CPF"
                  name="document"
                  value={documentMask(clientsForm.document)}
                  onChange={(e) =>
                    handleChangeClientForm(e as ChangeEvent<HTMLInputElement>)
                  }
                  inputProps={{ maxLength: 14 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <InputText
                  fullWidth
                  label="Telefone"
                  name="phone"
                  value={phoneMask(clientsForm.phone)}
                  onChange={(e) =>
                    handleChangeClientForm(e as ChangeEvent<HTMLInputElement>)
                  }
                  inputProps={{ maxLength: 15 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <InputText
                  fullWidth
                  label="Email"
                  name="email"
                  value={clientsForm.email}
                  onChange={(e) =>
                    handleChangeClientForm(e as ChangeEvent<HTMLInputElement>)
                  }
                />
              </Grid>
              <Grid item xs={12} lg={4}>
                <Password
                  fullWidth
                  label="Senha"
                  name="password"
                  value={clientsForm.password}
                  onChange={(e) =>
                    setClientsForm({ ...clientsForm, password: e.target.value })
                  }
                />
              </Grid>
            </Grid>
            <Divider style={{ margin: "14px 0px" }}>
              <Chip label="Endereço" />
            </Divider>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8} lg={8}>
                <InputText
                  label="Rua"
                  fullWidth
                  name="street"
                  value={addressForm.street}
                  onChange={(e) =>
                    handleChangeAddressForm(e as ChangeEvent<HTMLInputElement>)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <InputText
                  fullWidth
                  label="Número"
                  name="number"
                  value={addressForm.number}
                  onChange={(e) =>
                    handleChangeAddressForm(e as ChangeEvent<HTMLInputElement>)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputText
                  fullWidth
                  label="Complemento"
                  name="comp"
                  value={addressForm.comp}
                  onChange={(e) =>
                    handleChangeAddressForm(e as ChangeEvent<HTMLInputElement>)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputText
                  fullWidth
                  label="Bairro"
                  name="district"
                  value={addressForm.district}
                  onChange={(e) =>
                    handleChangeAddressForm(e as ChangeEvent<HTMLInputElement>)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <InputText
                  fullWidth
                  label="CEP"
                  name="cep"
                  value={cepMask(addressForm.cep)}
                  onChange={(e) =>
                    handleChangeAddressForm(e as ChangeEvent<HTMLInputElement>)
                  }
                  inputProps={{ maxLength: 9 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputText
                  fullWidth
                  label="Cidade"
                  name="city"
                  value={addressForm.city}
                  onChange={(e) =>
                    handleChangeAddressForm(e as ChangeEvent<HTMLInputElement>)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small" variant="filled">
                  <InputLabel id="demo-simple-select-label">Estado</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={addressForm.state}
                    label="Age"
                    onChange={(e) =>
                      handleChangeAddressForm(
                        e as ChangeEvent<HTMLInputElement>
                      )
                    }
                    name="state"
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
              </Grid>
            </Grid>
            <Grid container justifyContent={"flex-end"} mt={0.5} spacing={2}>
              <Grid item xs={12} sm={4} lg={3}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<AiOutlineSave />}
                  type="submit"
                >
                  Salvar
                </Button>
              </Grid>
            </Grid>
          </form>
        </DefaultContainer>
      </Container>
    </Fragment>
  );
}
