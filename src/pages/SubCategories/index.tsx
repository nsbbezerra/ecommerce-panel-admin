import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Fragment } from "react";
import { AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import AppBar from "../../components/layout/AppBar";
import Button from "../../components/layout/Button";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import IconButton from "../../components/layout/IconButton";
import InputText from "../../components/layout/InputText";
import Switch from "../../components/layout/Switch";
import Tooltip from "../../components/layout/Tooltip";
import { SeachContainer } from "../Clientes/styles";

export default function SubCategories() {
  const navigate = useNavigate();

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
              value={""}
              onChange={(e) => {}}
            />
          </SeachContainer>
        </Box>

        <DefaultContainer>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width={"5%"} align="center">
                    Ativo?
                  </TableCell>
                  <TableCell style={{ minWidth: "230px" }}>Nome</TableCell>
                  <TableCell style={{ minWidth: "230px" }}>Categoria</TableCell>
                  <TableCell style={{ minWidth: "160px" }}>Slug</TableCell>
                  <TableCell width={"5%"}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Switch />
                  </TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Stack direction={"row"}>
                      <Tooltip title="Editar" arrow>
                        <IconButton size="small" color="primary">
                          <AiOutlineEdit />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DefaultContainer>
      </Container>
    </Fragment>
  );
}
