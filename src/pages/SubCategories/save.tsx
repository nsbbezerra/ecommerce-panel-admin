import { Autocomplete, Box, Grid } from "@mui/material";
import { blue } from "@mui/material/colors";
import { FormEvent, Fragment, useEffect, useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import AppBar from "../../components/layout/AppBar";
import Button from "../../components/layout/Button";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import InputText from "../../components/layout/InputText";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import { CategoriesEntity } from "../../services/entities/categories";

interface TypeFormProps {
  type: "add" | "edit";
}

export default function SaveSubCategory() {
  const navigate = useNavigate();
  const { collection } = useParams();

  const [typeForm, setTypeForm] = useState<TypeFormProps>({ type: "add" });
  const [categories, setCategories] = useState<CategoriesEntity[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesEntity | null>(null);
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function getActiviesCategories() {
    api
      .get("/categories/all-actives")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => getErrorMessage({ error }));
  }

  function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCategory) {
      Swal.fire({
        title: "Atenção",
        text: "A categoria é obrigatória",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (!name.length) {
      Swal.fire({
        title: "Atenção",
        text: "O nome é obrigatório",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (typeForm.type === "add") {
      setIsLoading(true);
      api
        .post("/collections/save", {
          collection: {
            name,
            slug: name
              .normalize("NFD")
              .replaceAll(/[^\w\s]/gi, "")
              .replaceAll(" ", "-")
              .toLowerCase(),
            active: true,
            category_id: selectedCategory.id,
          },
        })
        .then((response) => {
          setIsLoading(false);
          Swal.fire({
            title: "Sucesso",
            text: response.data.message,
            icon: "success",
            confirmButtonColor: blue["500"],
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/dashboard/sub-categorias");
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
        .put("/collections/update", {
          collection: {
            id: collection,
            name,
            slug: name
              .normalize("NFD")
              .replaceAll(/[^\w\s]/gi, "")
              .replaceAll(" ", "-")
              .toLowerCase(),
            category_id: selectedCategory.id,
          },
        })
        .then((response) => {
          setIsLoading(false);
          Swal.fire({
            text: response.data.message,
            title: "Sucesso",
            icon: "success",
            confirmButtonColor: blue["500"],
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/dashboard/sub-categorias");
            }
          });
        })
        .catch((error) => {
          setIsLoading(false);
          getErrorMessage({ error });
        });
    }
  }

  function getCollectionById(id: string) {
    api
      .get(`/collections/get-by-id/${id}`)
      .then((response) => {
        console.log(response.data);
        setName(response.data.name);
        setSelectedCategory(response.data.category);
      })
      .catch((error) => getErrorMessage({ error }));
  }

  useEffect(() => {
    getActiviesCategories();
  }, []);

  useEffect(() => {
    if (collection) {
      setTypeForm({ type: "edit" });
      getCollectionById(collection);
    }
  }, [collection]);

  return (
    <Fragment>
      <AppBar
        title={`${typeForm.type === "add" ? "Nova" : "Editar"} Sub-categoria`}
      />
      <Container>
        <Box
          padding={"20px"}
          mb={-2}
          display="flex"
          justifyContent={"space-between"}
          alignItems="center"
          gap={2}
        >
          <Button
            onClick={() => navigate("/dashboard/sub-categorias")}
            startIcon={<FiChevronLeft />}
          >
            VOLTAR
          </Button>
        </Box>

        <DefaultContainer>
          <form onSubmit={saveCategory}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent={"flex-end"}
            >
              <Grid item xs={12} md={4} lg={4}>
                <Autocomplete
                  freeSolo
                  id="categories"
                  getOptionLabel={(option: any) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  options={categories}
                  renderInput={(params) => (
                    <InputText
                      {...params}
                      label="Categoria"
                      fullWidth
                      autoFocus
                    />
                  )}
                  value={selectedCategory}
                  onChange={(_, newValue) =>
                    setSelectedCategory(newValue as CategoriesEntity)
                  }
                />
              </Grid>
              <Grid item xs={12} md={5} lg={6}>
                <InputText
                  label="Nome"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={5} md={3} lg={2}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<AiOutlineSave />}
                  type="submit"
                  loading={isLoading}
                >
                  salvar
                </Button>
              </Grid>
            </Grid>
          </form>
        </DefaultContainer>
      </Container>
    </Fragment>
  );
}
