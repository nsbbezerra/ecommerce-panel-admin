import { Fragment, useEffect, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Button from "../../components/layout/Button";
import {
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlinePicture,
  AiOutlinePlus,
} from "react-icons/ai";
import DefaultContainer from "../../components/layout/DefaultContainer";
import Avatar from "../../components/layout/Avatar";
import IconButton from "../../components/layout/IconButton";
import { useNavigate } from "react-router-dom";
import { SupplierEntity } from "../../services/entities/supplier";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import Loading from "../../components/layout/Loading";
import EmptyBox from "../../components/layout/EmptyBox";
import Upload from "../../components/layout/Upload";
import getSuccessMessage from "../../helpers/getMessageSuccess";

export default function Supplier() {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState<SupplierEntity[]>([]);

  const [actualSupplier, setActualSupplier] = useState<SupplierEntity | null>(
    null
  );

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  function getAllSuppliers() {
    setIsLoading(true);
    api
      .get("/supplier")
      .then((response) => {
        setIsLoading(false);
        setSuppliers(response.data);
      })
      .catch((error) => {
        setIsLoading(false);
        getErrorMessage({ error });
      });
  }

  function handleImage(supplier: SupplierEntity | null) {
    setActualSupplier(supplier);
    setDrawerOpen(true);
  }

  function handleCloseDrawer() {
    setDrawerOpen(false);
    getAllSuppliers();
  }

  function activeSupplier(id: string, active: boolean) {
    api
      .put("/supplier/update", {
        supplier: {
          id,
          active,
        },
      })
      .then((response) => {
        getSuccessMessage({ message: response.data.message });
        getAllSuppliers();
      })
      .catch((error) => getErrorMessage({ error }));
  }

  useEffect(() => {
    getAllSuppliers();
  }, []);

  return (
    <Fragment>
      <AppBar title="Marcas" />

      <Container>
        <Box p={"20px"} mb={-2}>
          <Button
            onClick={() => {
              navigate("/dashboard/marcas/criar");
            }}
            variant="contained"
            startIcon={<AiOutlinePlus />}
            style={{ minWidth: "179px" }}
          >
            ADICIONAR NOVO
          </Button>
        </Box>

        <DefaultContainer disablePaddingInside>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {!suppliers.length ? (
                <EmptyBox label="Nenhuma informação encontrada" />
              ) : (
                <TableContainer sx={{ py: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: "20px", minWidth: "20px" }}>
                          Ativo?
                        </TableCell>
                        <TableCell sx={{ width: "70px", minWidth: "70px" }}>
                          Thumb
                        </TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell
                          sx={{
                            width: "20px",
                            minWidth: "20px",
                            textAlign: "center",
                          }}
                        >
                          Ações
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {suppliers.map((supplier) => (
                        <TableRow hover key={supplier.id}>
                          <TableCell>
                            <Switch
                              checked={supplier.active}
                              onChange={(e) =>
                                activeSupplier(supplier.id, e.target.checked)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Avatar src={supplier.thumbnail || ""} />
                          </TableCell>
                          <TableCell>{supplier.name}</TableCell>
                          <TableCell>
                            <Stack direction={"row"} spacing={1}>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() =>
                                  navigate(
                                    `/dashboard/marcas/editar/${supplier.id}`
                                  )
                                }
                              >
                                <AiOutlineEdit />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleImage(supplier)}
                              >
                                <AiOutlinePicture />
                              </IconButton>
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
            onFinish={() => handleCloseDrawer()}
            old={actualSupplier?.thumbnail as string}
            oldId={actualSupplier?.thumbnail_id as string}
            id={actualSupplier?.id as string}
            to="supplier"
          />
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
