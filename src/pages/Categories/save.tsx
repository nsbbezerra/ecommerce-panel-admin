import { FormEvent, Fragment, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Button from "../../components/layout/Button";
import Container from "../../components/layout/Container";
import { useNavigate } from "react-router-dom";
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

interface LoadingType {
  from: "thumbnail" | "form";
  loading: boolean;
}

export default function SaveCategoryPage() {
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
  }

  return (
    <Fragment>
      <AppBar title="Nova categoria" />
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
              <Grid item xs={12}>
                <Upload
                  name="thumbnail"
                  to="category"
                  id={categoryId}
                  disabled={categoryId.length ? false : true}
                  onFinish={() => navigate("/dashboard/categorias")}
                />
              </Grid>
            </Grid>
          </form>
        </DefaultContainer>
      </Container>
    </Fragment>
  );
}
