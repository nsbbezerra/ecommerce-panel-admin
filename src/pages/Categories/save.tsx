import { FormEvent, Fragment, useEffect, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Button from "../../components/layout/Button";
import Container from "../../components/layout/Container";
import { useNavigate, useParams } from "react-router-dom";
import DefaultContainer from "../../components/layout/DefaultContainer";
import InputText from "../../components/layout/InputText";
import { CategoriesDto } from "../../services/dto/categories";
import Swal from "sweetalert2";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import { FiChevronLeft } from "react-icons/fi";
import { Box, Grid } from "@mui/material";
import { AiOutlineSave } from "react-icons/ai";
import Upload from "../../components/layout/Upload";
import { blue, red } from "@mui/material/colors";
import getSuccessMessage from "../../helpers/getMessageSuccess";

interface LoadingType {
  from: "thumbnail" | "form";
  loading: boolean;
}

interface TypeFormProps {
  type: "add" | "edit";
}

export default function SaveCategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState<string>("");
  const [categoryForm, setCategoryForm] = useState<CategoriesDto>({
    active: true,
    name: "",
    slug: "",
  });
  const [isLoading, setIsLoading] = useState<LoadingType>({
    from: "form",
    loading: false,
  });
  const [typeForm, setTypeForm] = useState<TypeFormProps>({ type: "add" });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!categoryForm.name.length) {
      Swal.fire({
        title: "Atenção",
        text: "O nome é obrigatório",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }

    if (typeForm.type === "add") {
      setIsLoading({ from: "form", loading: true });

      api
        .post("/categories/save", {
          category: {
            active: categoryForm.active,
            name: categoryForm.name,
            slug: categoryForm.name
              .normalize("NFD")
              .replaceAll(/[^\w\s]/gi, "")
              .replaceAll(" ", "-")
              .toLowerCase(),
          },
        })
        .then((response) => {
          setCategoryId(response.data.categoryId);
          Swal.fire({
            title: "Sucesso!",
            text: `${response.data.message}, agora deseja inserir uma foto para esta categoria?`,
            icon: "success",
            showDenyButton: true,
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: "Sim",
            denyButtonText: "Não",
            confirmButtonColor: blue["500"],
            denyButtonColor: red["500"],
          }).then((result) => {
            if (result.isDenied) {
              navigate("/dashboard/categorias");
            }
          });
          setIsLoading({ from: "form", loading: false });
        })
        .catch((error) => {
          getErrorMessage({ error });
          setIsLoading({ from: "form", loading: false });
        });
    } else {
      api
        .put(`/categories/update`, {
          category: {
            id: category,
            name: categoryForm.name,
            slug: categoryForm.name
              .normalize("NFD")
              .replaceAll(/[^\w\s]/gi, "")
              .replaceAll(" ", "-")
              .toLowerCase(),
          },
        })
        .then((response) => {
          Swal.fire({
            title: "Sucesso!",
            text: response.data.message,
            icon: "success",
            confirmButtonColor: blue["500"],
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/dashboard/categorias");
            }
          });
        })
        .catch((error) => {
          getErrorMessage({ error });
        });
    }
  }

  function getCategoryById(id: string) {
    api
      .get(`/categories/get-by-id/${id}`)
      .then((response) => {
        setCategoryForm({ ...categoryForm, name: response.data.name });
      })
      .catch((error) => getErrorMessage({ error }));
  }

  useEffect(() => {
    if (category) {
      setTypeForm({ type: "edit" });
      getCategoryById(category);
    }
  }, [category]);

  return (
    <Fragment>
      <AppBar
        title={`${typeForm.type === "add" ? "Nova" : "Editar"} categoria`}
      />
      <Container>
        <Box p={"20px"} mb={-2}>
          <Button
            onClick={() => navigate("/dashboard/categorias")}
            startIcon={<FiChevronLeft />}
          >
            Voltar
          </Button>
        </Box>
      </Container>

      <Container>
        <DefaultContainer>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8} md={9} lg={10}>
                <InputText
                  label="Nome"
                  fullWidth
                  autoFocus
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  value={categoryForm.name}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={3} lg={2}>
                <Button
                  loading={isLoading.from === "form" && isLoading.loading}
                  fullWidth
                  startIcon={<AiOutlineSave />}
                  variant="contained"
                  size="large"
                  type="submit"
                >
                  Salvar
                </Button>
              </Grid>
              {typeForm.type === "add" && (
                <Grid item xs={12}>
                  <Upload
                    name="thumbnail"
                    to="category"
                    id={categoryId}
                    disabled={categoryId.length ? false : true}
                    onFinish={() => navigate("/dashboard/categorias")}
                  />
                </Grid>
              )}
            </Grid>
          </form>
        </DefaultContainer>
      </Container>
    </Fragment>
  );
}
