import {
  Autocomplete,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { Fragment, useEffect, useState } from "react";
import {
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineSave,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AppBar from "../../components/layout/AppBar";
import Button from "../../components/layout/Button";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import IconButton from "../../components/layout/IconButton";
import InputText from "../../components/layout/InputText";
import Loading from "../../components/layout/Loading";
import Switch from "../../components/layout/Switch";
import Tooltip from "../../components/layout/Tooltip";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import { CategoriesEntity } from "../../services/entities/categories";
import { CollectionsWithRelationshipEntity } from "../../services/entities/collections";
import { SeachContainer } from "../Clientes/styles";

export default function SubCategories() {
  const navigate = useNavigate();

  const [collections, setCollections] = useState<
    CollectionsWithRelationshipEntity[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const filteredCollections = search.length
    ? collections.filter((obj) =>
        obj.name.toLowerCase().includes(search.toLowerCase())
      )
    : collections;

  function getAllCollections() {
    setIsLoading(true);
    api
      .get("/collections/get-all")
      .then((response) => {
        setIsLoading(false);
        setCollections(response.data);
      })
      .catch((error) => {
        setIsLoading(false);
        getErrorMessage({ error });
      });
  }

  function handleActive(id: string, active: boolean) {
    api
      .put("/collections/update", {
        collection: {
          id,
          active,
        },
      })
      .then((response) => {
        Swal.fire({
          text: response.data.message,
          title: "Sucesso",
          icon: "success",
          confirmButtonColor: blue["500"],
        });
        getAllCollections();
      })
      .catch((error) => {
        getErrorMessage({ error });
      });
  }

  useEffect(() => {
    getAllCollections();
  }, []);

  return (
    <Fragment>
      <AppBar title="Sub-categorias" />
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
            onClick={() => navigate("/dashboard/sub-categorias/criar")}
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
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </SeachContainer>
        </Box>

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
                    <TableCell style={{ minWidth: "230px" }}>Nome</TableCell>
                    <TableCell style={{ minWidth: "230px" }}>
                      Categoria
                    </TableCell>
                    <TableCell style={{ minWidth: "160px" }}>Slug</TableCell>
                    <TableCell width={"5%"}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCollections.map((collection) => (
                    <TableRow key={collection.id} hover>
                      <TableCell>
                        <Switch
                          checked={collection.active}
                          onChange={(e) =>
                            handleActive(collection.id, e.target.checked)
                          }
                        />
                      </TableCell>
                      <TableCell>{collection.name}</TableCell>
                      <TableCell>{collection.category.name}</TableCell>
                      <TableCell>{collection.slug}</TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        <Stack direction={"row"}>
                          <Tooltip title="Editar" arrow>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() =>
                                navigate(
                                  `/dashboard/sub-categorias/editar/${collection.id}`
                                )
                              }
                            >
                              <AiOutlineEdit />
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
    </Fragment>
  );
}
