import { Fragment } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import {
  Box,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Button from "../../components/layout/Button";
import { AiOutlineEdit, AiOutlinePicture, AiOutlinePlus } from "react-icons/ai";
import DefaultContainer from "../../components/layout/DefaultContainer";
import Avatar from "../../components/layout/Avatar";
import IconButton from "../../components/layout/IconButton";
import { useNavigate } from "react-router-dom";

export default function Supplier() {
  const navigate = useNavigate();

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
                <TableRow hover>
                  <TableCell>
                    <Switch size="small" />
                  </TableCell>
                  <TableCell>
                    <Avatar />
                  </TableCell>
                  <TableCell>Adidas</TableCell>
                  <TableCell>
                    <Stack direction={"row"} spacing={1}>
                      <IconButton size="small" color="primary">
                        <AiOutlineEdit />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <AiOutlinePicture />
                      </IconButton>
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
