import { Fragment, useEffect, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import { GetAllClientsEntity } from "../../services/entities/clients";
import { configs } from "../../configs";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import Loading from "../../components/layout/Loading";
import {
  Box,
  Card,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import IconButton from "../../components/layout/IconButton";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Button from "../../components/layout/Button";
import { SeachContainer } from "./styles";
import InputText from "../../components/layout/InputText";
import { AiOutlineDropbox, AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { BsFillStarFill } from "react-icons/bs";
import { FaMapMarkedAlt } from "react-icons/fa";
import { AddressesEntity } from "../../services/entities/address";
import { grey } from "@mui/material/colors";
import EmptyBox from "../../components/layout/EmptyBox";

interface CollapesdProps {
  id: string;
  open: boolean;
}

export default function ClientsPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<GetAllClientsEntity[]>([]);
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddressLoading, setIsAddressLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [isCollapesed, setIsCollapesed] = useState<CollapesdProps>({
    id: "",
    open: false,
  });
  const [addresses, setAddresses] = useState<AddressesEntity[]>([]);

  function getAllClients(actualPage: number) {
    setPage(actualPage);
    setIsLoading(true);
    api
      .get(
        `/clients/get-all/${actualPage * configs.paginationItems}/${
          configs.paginationItems
        }`
      )
      .then((response) => {
        const results = response.data.clients;
        setTotalItems(response.data.total);
        if (actualPage === 0) {
          setClients(results);
        } else {
          setClients([...clients, ...results]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        getErrorMessage({ error });
      });
  }

  function handleSearch(name: string) {
    setSearch(name);
    if (name === "") {
      getAllClients(0);
    }

    if (name.length > 1) {
      setIsLoading(true);
      api
        .post("/clients/get-by-name", {
          name: search,
        })
        .then((response) => {
          setIsLoading(false);
          setClients(response.data);
        })
        .catch((error) => {
          getErrorMessage({ error });
          setIsLoading(false);
        });
    }
  }

  function handleMore() {
    const actualPage = page + 1;
    getAllClients(actualPage);
  }

  function getAddress(id: string) {
    setIsAddressLoading(true);
    setIsCollapesed({
      id,
      open: isCollapesed.id === id && isCollapesed.open === true ? false : true,
    });

    api
      .get(`/addresses/get-by-client-id/${id}`)
      .then((response) => {
        setAddresses(response.data);
        setIsAddressLoading(false);
      })
      .catch((error) => {
        getErrorMessage({ error });
        setIsAddressLoading(false);
      });
  }

  useEffect(() => {
    getAllClients(0);
  }, []);

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
          flexWrap={"wrap"}
        >
          <Button
            onClick={() => navigate("/dashboard/clientes/criar")}
            variant="contained"
            startIcon={<AiOutlinePlus />}
            style={{ minWidth: "179px" }}
          >
            ADICIONAR NOVO
          </Button>
          <SeachContainer>
            <InputText
              label="Digite um nome para buscar"
              fullWidth
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </SeachContainer>
        </Box>

        <DefaultContainer disablePaddingInside>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {clients.length === 0 ? (
                <EmptyBox label="Nenhuma informação encontrada" />
              ) : (
                <TableContainer sx={{ py: 1 }}>
                  <Table size="small" aria-label="collapsible table">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ minWidth: "280px" }}>
                          Nome
                        </TableCell>
                        <TableCell style={{ minWidth: "150px" }}>
                          Documento
                        </TableCell>
                        <TableCell style={{ minWidth: "150px" }}>
                          Telefone
                        </TableCell>
                        <TableCell style={{ minWidth: "180px" }}>
                          Email
                        </TableCell>
                        <TableCell align="center" width={"5%"}>
                          Endereço
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {clients.map((client) => (
                        <>
                          <TableRow
                            hover
                            key={client.id}
                            sx={{ "& > *": { borderBottom: "0" } }}
                          >
                            <TableCell sx={{ borderBottom: 0 }}>
                              {client.name}
                            </TableCell>
                            <TableCell sx={{ borderBottom: 0 }}>
                              {client.document}
                            </TableCell>
                            <TableCell sx={{ borderBottom: 0 }}>
                              {client.phone}
                            </TableCell>
                            <TableCell sx={{ borderBottom: 0 }}>
                              {client.email}
                            </TableCell>
                            <TableCell
                              sx={{ textAlign: "center", borderBottom: 0 }}
                            >
                              <IconButton
                                color="info"
                                size="small"
                                onClick={() => getAddress(client.id)}
                              >
                                {isCollapesed.id === client.id &&
                                isCollapesed.open ? (
                                  <FiChevronUp />
                                ) : (
                                  <FiChevronDown />
                                )}
                              </IconButton>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              style={{ paddingBottom: 0, paddingTop: 0 }}
                            >
                              <Collapse
                                in={
                                  isCollapesed.open &&
                                  isCollapesed.id === client.id
                                }
                                timeout="auto"
                                unmountOnExit
                                style={{ padding: "10px 0px" }}
                              >
                                <Stack spacing={2}>
                                  {addresses.length ? (
                                    <>
                                      {addresses.map((address) => (
                                        <Card
                                          variant="elevation"
                                          sx={{ bgcolor: grey["100"] }}
                                          elevation={0}
                                          key={address.id}
                                        >
                                          <List
                                            sx={{ width: "100%" }}
                                            aria-label="contacts"
                                            dense
                                          >
                                            <ListItem>
                                              <ListItemIcon>
                                                <FaMapMarkedAlt fontSize={25} />
                                              </ListItemIcon>
                                              <ListItemText
                                                primary={`${address.street}, número: ${address.number}`}
                                              />
                                            </ListItem>
                                            <ListItem>
                                              <ListItemText
                                                inset
                                                primary={address.district}
                                              />
                                            </ListItem>
                                            <ListItem>
                                              <ListItemText
                                                inset
                                                primary={`CEP: ${address.cep}`}
                                              />
                                            </ListItem>
                                            <ListItem>
                                              <ListItemText
                                                inset
                                                primary={`${address.city} - ${address.state}`}
                                              />
                                            </ListItem>
                                            {address.default && (
                                              <ListItem>
                                                <ListItemIcon>
                                                  <BsFillStarFill />
                                                </ListItemIcon>
                                                <ListItemText secondary="Endereço padrão" />
                                              </ListItem>
                                            )}
                                          </List>
                                        </Card>
                                      ))}
                                    </>
                                  ) : (
                                    <>
                                      {isAddressLoading ? (
                                        <Loading />
                                      ) : (
                                        <Card
                                          variant="elevation"
                                          sx={{ bgcolor: grey["100"] }}
                                          elevation={0}
                                        >
                                          <Box
                                            display={"flex"}
                                            justifyContent="center"
                                            alignItems={"center"}
                                            flexDirection="column"
                                            padding={"10px"}
                                          >
                                            <AiOutlineDropbox fontSize={50} />
                                            <span>Nada encontrado</span>
                                          </Box>
                                        </Card>
                                      )}
                                    </>
                                  )}
                                </Stack>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
          {clients.length !== 0 && (
            <>
              {search.length ? (
                ""
              ) : (
                <Box display={"flex"} justifyContent="center" pb={1}>
                  <Button
                    onClick={() => handleMore()}
                    disabled={totalItems === clients.length}
                  >
                    Mostrar mais
                  </Button>
                </Box>
              )}
            </>
          )}
        </DefaultContainer>
      </Container>
    </Fragment>
  );
}
