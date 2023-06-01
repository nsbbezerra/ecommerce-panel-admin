import { Fragment, useEffect, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import { Box, Grid } from "@mui/material";
import Button from "../../components/layout/Button";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import DefaultContainer from "../../components/layout/DefaultContainer";
import InputText from "../../components/layout/InputText";
import { AiOutlineSave } from "react-icons/ai";
import Upload from "../../components/layout/Upload";
import Swal from "sweetalert2";
import { blue, red } from "@mui/material/colors";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import getSuccessMessage from "../../helpers/getMessageSuccess";

export default function SaveSupplier() {
  const navigate = useNavigate();

  const { supplier } = useParams();

  const [supplierId, setSupplierId] = useState<string>("");

  const [formType, setFormType] = useState<"add" | "edit">("add");

  const [name, setName] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  function saveSupplier() {
    if (!name.length) {
      Swal.fire({
        title: "Atenção",
        text: "O nome é obrigatório",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }

    if (formType === "add") {
      setIsLoading(true);
      api
        .post("/supplier/save", {
          supplier: {
            name,
          },
        })
        .then((response) => {
          setIsLoading(false);
          setSupplierId(response.data.id);
          Swal.fire({
            title: "Sucesso!",
            text: `${response.data.message}, agora deseja inserir uma foto para esta marca?`,
            icon: "success",
            showDenyButton: true,
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: "Sim",
            denyButtonText: "Não",
            confirmButtonColor: blue["500"],
            denyButtonColor: red["500"],
          }).then((results) => {
            if (results.isDenied) {
              navigate("/dashboard/marcas");
            }
          });
        })
        .catch((error) => {
          setIsLoading(false);
          getErrorMessage({ error });
        });
    } else {
      setIsLoading(true);
      api
        .put(`/supplier/update`, {
          supplier: {
            id: supplier,
            name,
          },
        })
        .then((response) => {
          setIsLoading(false);
          getSuccessMessage({ message: response.data.message });
          navigate("/dashboard/marcas");
        })
        .catch((error) => {
          setIsLoading(false);
          getErrorMessage({ error });
        });
    }
  }

  function getSupplierById() {
    api
      .get(`/supplier/${supplier}`)
      .then((response) => {
        setName(response.data.name || "");
      })
      .catch((error) => getErrorMessage({ error }));
  }

  useEffect(() => {
    if (supplier) {
      setFormType("edit");
      getSupplierById();
    }
  }, [supplier]);

  return (
    <Fragment>
      <AppBar title={`${formType === "add" ? "Criar" : "Editar"} Marca`} />

      <Container>
        <Box padding={"20px"} mb={-2}>
          <Button
            startIcon={<FiChevronLeft />}
            onClick={() => navigate("/dashboard/marcas")}
          >
            Voltar
          </Button>
        </Box>

        <DefaultContainer>
          <Grid container spacing={2} alignItems={"center"}>
            <Grid item xs={12} sm={8} md={9} lg={10}>
              <InputText
                label="Nome"
                fullWidth
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <Button
                fullWidth
                startIcon={<AiOutlineSave />}
                variant="contained"
                size="large"
                loading={isLoading}
                onClick={saveSupplier}
              >
                Salvar
              </Button>
            </Grid>

            {formType === "add" && (
              <Grid item xs={12}>
                <Upload
                  id={supplierId}
                  name="thumbnail"
                  to="supplier"
                  disabled={!supplierId.length}
                  onFinish={() => navigate("/dashboard/marcas")}
                />
              </Grid>
            )}
          </Grid>
        </DefaultContainer>
      </Container>
    </Fragment>
  );
}
