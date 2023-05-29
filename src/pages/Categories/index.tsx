import { Fragment, useEffect, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Button from "../../components/layout/Button";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import { CategoriesEntity } from "../../services/entities/categories";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import Loading from "../../components/layout/Loading";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlinePicture,
  AiOutlinePlus,
} from "react-icons/ai";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { SeachContainer } from "../Clientes/styles";
import InputText from "../../components/layout/InputText";
import Switch from "../../components/layout/Switch";
import Avatar from "../../components/layout/Avatar";
import IconButton from "../../components/layout/IconButton";
import getSuccessMessage from "../../helpers/getMessageSuccess";
import Upload from "../../components/layout/Upload";
import Tooltip from "../../components/layout/Tooltip";
import EmptyBox from "../../components/layout/EmptyBox";

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

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = (id: string) => {
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

  function getAllCategories() {
    setIsLoading(true);
    api
      .get("/categories/get-all")
      .then((response) => {
        setIsLoading(false);
        setCategories(response.data);
      })
      .catch((error) => {
        setIsLoading(false);
        getErrorMessage({ error });
      });
  }

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
        getAllCategories();
      })
      .catch((error) => getErrorMessage({ error }));
  }

  function handleFinishChangeImage() {
    setDrawerOpen(false);
    getAllCategories();
  }

  useEffect(() => {
    getAllCategories();
  }, []);

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
        <DefaultContainer disablePaddingInside>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {filteredCategories.length === 0 ? (
                <EmptyBox label="Nenhuma informação encontrada" />
              ) : (
                <TableContainer sx={{ py: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell width={"5%"} align="center">
                          Ativo?
                        </TableCell>
                        <TableCell width={"5%"} align="center">
                          Thumb
                        </TableCell>
                        <TableCell style={{ minWidth: "280px" }}>
                          Nome
                        </TableCell>
                        <TableCell style={{ minWidth: "280px" }}>
                          Slug
                        </TableCell>
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
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/categorias/editar/${category.id}`
                                    )
                                  }
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
                                  onClick={() => handleClick(category.id)}
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
            </>
          )}
        </DefaultContainer>
      </Container>

      <Dialog
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Box
            display={"flex"}
            width={"100%"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="h6">Alterar Imagem</Typography>
            <IconButton size="small" onClick={() => setDrawerOpen(false)}>
              <AiOutlineClose />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Upload
            name="thumbnail"
            onFinish={handleFinishChangeImage}
            old={category.thumbnail}
            oldId={category.thumbnailId}
            id={category.categoryId}
            to="category"
          />
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
