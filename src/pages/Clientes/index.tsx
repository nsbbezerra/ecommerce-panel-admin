import { Fragment, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import { GetAllClientsEntity } from "../../services/entities/clients";
import { useQuery } from "react-query";
import { configs } from "../../configs";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import Loading from "../../components/layout/Loading";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import IconButton from "../../components/layout/IconButton";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Button from "../../components/layout/Button";
import { ResultsText, SeachContainer } from "./styles";
import InputText from "../../components/layout/InputText";

export default function ClientsPage() {
  const [clients, setClients] = useState<GetAllClientsEntity[]>([]);

  const { isLoading } = useQuery(
    "clients",
    async () => {
      return await api.get("/clients/get-all");
    },
    {
      refetchInterval: configs.refetch,
      onError: (error) => getErrorMessage({ error }),
      onSuccess(response) {
        setClients(response.data);
      },
    }
  );

  return (
    <Fragment>
      <AppBar title="Clientes" />
      <Container>
        <Box
          mb={-2}
          p={"20px"}
          display="flex"
          justifyContent={"space-between"}
          gap={2}
          alignItems="center"
        >
          <ResultsText>
            {clients.length} {clients.length > 1 ? "Resultados" : "Resultado"}
          </ResultsText>
          <SeachContainer>
            <InputText label="Digite para buscar" fullWidth />
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
                    <TableCell style={{ minWidth: "280px" }}>Nome</TableCell>
                    <TableCell style={{ minWidth: "150px" }}>
                      Documento
                    </TableCell>
                    <TableCell style={{ minWidth: "150px" }}>
                      Telefone
                    </TableCell>
                    <TableCell style={{ minWidth: "180px" }}>Email</TableCell>
                    <TableCell align="center" width={"5%"}>
                      Endereço
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow hover key={client.id}>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.document}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell align="center">
                        <IconButton color="info" size="small">
                          <FiChevronDown />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Box display={"flex"} justifyContent="center">
                        <Button>Mostrar mais</Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          )}
        </DefaultContainer>
      </Container>
    </Fragment>
  );
}
