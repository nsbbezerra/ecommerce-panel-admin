import { Fragment, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Button from "../../components/layout/Button";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import { CategoriesEntity } from "../../services/entities/categories";
import { useQuery } from "react-query";
import { api } from "../../configs/api";
import { configs } from "../../configs";
import getErrorMessage from "../../helpers/getMessageError";
import Loading from "../../components/layout/Loading";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlinePicture,
  AiOutlinePlus,
  AiOutlineSave,
} from "react-icons/ai";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { SeachContainer } from "../Clientes/styles";
import InputText from "../../components/layout/InputText";
import Switch from "../../components/layout/Switch";
import Avatar from "../../components/layout/Avatar";
import IconButton from "../../components/layout/IconButton";
import getSuccessMessage from "../../helpers/getMessageSuccess";
import Swal from "sweetalert2";
import { blue } from "@mui/material/colors";
import Upload from "../../components/layout/Upload";
import Tooltip from "../../components/layout/Tooltip";

interface Props {
  categoryId: string;
  categoryName: string;
  thumbnailId: string;
  thumbnail: string;
}

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoriesEntity[]>([]);
  const [category, setCategory] = useState<Props>({
    categoryId: "",
    categoryName: "",
    thumbnailId: "",
    thumbnail: "",
  });
  const [editMode, setEditMode] = useState<"edit" | "image">("edit");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const handleClick = (mode: "edit" | "image", id: string) => {
    setEditMode(mode);
    const result = categories.find((obj) => obj.id === id);
    setCategory({
      ...category,
      categoryId: id,
      categoryName: result?.name || "",
      thumbnailId: result?.thumbnail_id || "",
      thumbnail: result?.thumbnail || "",
    });
    setDrawerOpen(true);
  };

  const filteredCategories = search.length
    ? categories.filter((obj) =>
        obj.name.toLowerCase().includes(search.toLowerCase())
      )
    : categories;

  const { isLoading, refetch } = useQuery(
    "categories",
    async () => {
      return await api.get("/categories/get-all");
    },
    {
      refetchInterval: configs.refetch,
      onError: (error) => getErrorMessage({ error }),
      onSuccess(response) {
        setCategories(response.data);
      },
    }
  );

  function handleActive(id: string, active: boolean) {
    api
      .put(`/categories/update`, {
        category: {
          id,
          active,
        },
      })
      .then((response) => {
        getSuccessMessage({ message: response.data.message });
        refetch();
      })
      .catch((error) => getErrorMessage({ error }));
  }

  function handleEdit() {
    if (!category.categoryName.length) {
      Swal.fire({
        title: "Atenção",
        text: "O nome é obrigatório",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    setLoading(true);
    api
      .put(`/categories/update`, {
        category: {
          id: category.categoryId,
          name: category.categoryName,
          slug: category.categoryName
            .normalize("NFD")
            .replaceAll(/[^\w\s]/gi, "")
            .replaceAll(" ", "-")
            .toLowerCase(),
        },
      })
      .then((response) => {
        getSuccessMessage({ message: response.data.message });
        refetch();
        setLoading(false);
        setDrawerOpen(false);
      })
      .catch((error) => {
        setDrawerOpen(false);
        getErrorMessage({ error });
        setLoading(false);
      });
  }

  function handleModalClose() {
    setEditMode("edit");
    setDrawerOpen(false);
    refetch();
  }

  function handleFinishChangeImage() {
    setDrawerOpen(false);
    refetch();
  }

  return (
    <Fragment>
      <AppBar title="Categorias" />
      <Container>
        <Box
          padding={"20px"}
          mb={-2}
          display="flex"
          justifyContent={"space-between"}
          alignItems="center"
          gap={2}
          flexWrap={"wrap"}
        >
          <Button
            onClick={() => navigate("/dashboard/categorias/criar")}
            variant="contained"
            startIcon={<AiOutlinePlus />}
            style={{ minWidth: "179px" }}
          >
            ADICIONAR NOVA
          </Button>

          <SeachContainer>
            <InputText
              label="Digite para buscar"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SeachContainer>
        </Box>
      </Container>

      <Container>
        <DefaultContainer>
          {isLoading ? (
            <Loading />
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width={"5%"} align="center">
                      Ativo?
                    </TableCell>
                    <TableCell width={"5%"} align="center">
                      Thumb
                    </TableCell>
                    <TableCell style={{ minWidth: "280px" }}>Nome</TableCell>
                    <TableCell style={{ minWidth: "280px" }}>Slug</TableCell>
                    <TableCell width={"5%"} align="center">
                      Ações
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id} hover>
                      <TableCell align="center">
                        <Switch
                          checked={category.active}
                          onChange={(e) =>
                            handleActive(category.id, e.target.checked)
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Avatar src={category.thumbnail as string} />
                      </TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell align="center">
                        <Stack spacing={1} direction="row">
                          <Tooltip title="Editar" arrow>
                            <IconButton
                              id="basic-button"
                              aria-haspopup="true"
                              onClick={() => handleClick("edit", category.id)}
                              size="small"
                              color="primary"
                            >
                              <AiOutlineEdit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Alterar Imagem" arrow>
                            <IconButton
                              id="basic-button"
                              aria-haspopup="true"
                              onClick={() => handleClick("image", category.id)}
                              size="small"
                              color="primary"
                            >
                              <AiOutlinePicture />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DefaultContainer>
      </Container>

      <Dialog
        open={drawerOpen}
        onClose={() => handleModalClose()}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editMode === "edit" ? "Editar" : "Alterar Imagem"}
        </DialogTitle>
        <DialogContent>
          {editMode === "edit" ? (
            <InputText
              autoFocus
              fullWidth
              label="Nome"
              value={category.categoryName}
              onChange={(e) =>
                setCategory({ ...category, categoryName: e.target.value })
              }
            />
          ) : (
            <Upload
              name="thumbnail"
              onFinish={handleFinishChangeImage}
              old={category.thumbnail}
              oldId={category.thumbnailId}
              id={category.categoryId}
              to="category"
            />
          )}
        </DialogContent>
        <DialogActions style={{ padding: "0px 24px 20px 0px" }}>
          {editMode === "edit" ? (
            <>
              <Button
                onClick={() => handleModalClose()}
                color="error"
                startIcon={<AiOutlineClose />}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleEdit()}
                startIcon={<AiOutlineSave />}
                variant="contained"
                loading={loading}
              >
                Salvar
              </Button>
            </>
          ) : (
            <Button
              onClick={() => handleModalClose()}
              color="error"
              startIcon={<AiOutlineClose />}
            >
              Cancelar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
