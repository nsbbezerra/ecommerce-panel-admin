import {
  Box,
  Card,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import {
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlinePicture,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineTag,
} from "react-icons/ai";
import { BsTruck } from "react-icons/bs";
import { FiChevronDown, FiChevronUp, FiPackage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AppBar from "../../components/layout/AppBar";
import Avatar from "../../components/layout/Avatar";
import Button from "../../components/layout/Button";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import IconButton from "../../components/layout/IconButton";
import InputText from "../../components/layout/InputText";
import Switch from "../../components/layout/Switch";
import Tooltip from "../../components/layout/Tooltip";
import { ProductsWithRelationshipEntity } from "../../services/entities/products";
import { api } from "../../configs/api";
import { configs } from "../../configs";
import getErrorMessage from "../../helpers/getMessageError";
import Loading from "../../components/layout/Loading";
import formatCurrency from "../../helpers/formatCurrency";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { HiOutlineCollection } from "react-icons/hi";
import Upload from "../../components/layout/Upload";
import { blue, grey, red } from "@mui/material/colors";
import getSuccessMessage from "../../helpers/getMessageSuccess";
import Swal from "sweetalert2";
import calcDiscount from "../../helpers/calcPercentage";

interface CollapsedProps {
  id: string;
  open: boolean;
}

export default function ProductsPage() {
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [productToupdate, setProductToUpdate] =
    useState<ProductsWithRelationshipEntity | null>(null);

  const [page, setPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const [products, setProducts] = useState<ProductsWithRelationshipEntity[]>(
    []
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isCollapesed, setIsCollapsed] = useState<CollapsedProps>({
    id: "",
    open: false,
  });

  const [search, setSearch] = useState<string>("all");
  const [name, setName] = useState<string>("");

  function getAllProducts(actualPage: number) {
    if (search === "all") {
      setPage(actualPage);
      const paginate = actualPage * configs.paginationItems;
      api
        .get(`/products/get-all/${paginate}/${configs.paginationItems}`)
        .then((response) => {
          setIsLoading(false);
          setProducts(response.data.products);
          setTotalItems(response.data.total);
        })
        .catch((error) => {
          setIsLoading(false);
          getErrorMessage({ error });
        });
    } else {
      setIsLoading(true);
      api
        .post(`/products/search/${search}`, {
          name,
        })
        .then((response) => {
          setIsLoading(false);
          setProducts(response.data);
        })
        .catch((error) => {
          setIsLoading(false);
          getErrorMessage({ error });
        });
    }
  }

  function handleEditProduct(prod: ProductsWithRelationshipEntity) {
    setProductToUpdate(prod);
    setDrawerOpen(true);
  }

  function handleCloseModal() {
    setDrawerOpen(false);
    getAllProducts(0);
  }

  function handleMore() {
    const actualPage = page + 1;
    getAllProducts(actualPage);
  }

  function activeProduct(id: string, active: boolean) {
    api
      .put("/products/update", {
        product: {
          id,
          active,
        },
      })
      .then((response) => {
        getSuccessMessage({ message: response.data.message });
        getAllProducts(0);
      })
      .catch((error) => getErrorMessage({ error }));
  }

  function setPromoProduct(id: string, promo: boolean) {
    Swal.fire({
      title: "Atenção",
      text: "Insira a porcentagem do desconto",
      icon: "info",
      confirmButtonText: "Salvar",
      denyButtonText: "Cancelar",
      showDenyButton: true,
      denyButtonColor: red["500"],
      confirmButtonColor: blue["500"],
      input: "text",
      showLoaderOnConfirm: true,
      inputValue: 0,
    }).then((results) => {
      if (results.isConfirmed) {
        api
          .put("/products/update", {
            product: {
              id,
              promotional: promo,
              promo_rate: Number(results.value),
            },
          })
          .then((response) => {
            getSuccessMessage({ message: response.data.message });
            getAllProducts(0);
          })
          .catch((error) => getErrorMessage({ error }));
      }
    });
  }

  useEffect(() => {
    getAllProducts(0);
  }, []);

  return (
    <Fragment>
      <AppBar title="Produtos" />

      <Container>
        <Box
          p="20px"
          display={"flex"}
          justifyContent="space-between"
          gap={2}
          alignItems="center"
          mb={-2}
          flexWrap="wrap"
        >
          <Button
            onClick={() => navigate("/dashboard/produtos/criar")}
            variant="contained"
            startIcon={<AiOutlinePlus />}
            style={{ minWidth: "179px" }}
          >
            ADICIONAR NOVO
          </Button>

          <Grid
            container
            spacing={1}
            alignItems={"center"}
            xs={12}
            sm={12}
            md={8}
            lg={6}
          >
            <Grid item xs={12} sm={3}>
              <FormControl variant="filled" size="small" fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Buscar por
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={search}
                  label="Buscar por"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                >
                  <MenuItem value={"name"}>Nome</MenuItem>
                  <MenuItem value={"promo"}>Promocionais</MenuItem>
                  <MenuItem value={"block"}>Bloqueados</MenuItem>
                  <MenuItem value={"all"}>Todos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputText
                label="Digite para buscar"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={search !== "name" ? true : false}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AiOutlineSearch />}
                fullWidth
                onClick={() => getAllProducts(0)}
              >
                Buscar
              </Button>
            </Grid>
          </Grid>
        </Box>

        <DefaultContainer>
          {isLoading ? (
            <Loading />
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "5%", textAlign: "center" }}>
                      Ativo?
                    </TableCell>
                    <TableCell sx={{ width: "5%", textAlign: "center" }}>
                      Promo?
                    </TableCell>
                    <TableCell sx={{ width: "5%", textAlign: "center" }}>
                      Thumb
                    </TableCell>
                    <TableCell sx={{ minWidth: "260px" }}>Nome</TableCell>
                    <TableCell sx={{ minWidth: "90px", textAlign: "center" }}>
                      Informações
                    </TableCell>
                    <TableCell sx={{ minWidth: "120px", textAlign: "right" }}>
                      Preço
                    </TableCell>
                    <TableCell sx={{ width: "10%", textAlign: "center" }}>
                      Ações
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <>
                      <TableRow
                        key={product.id}
                        sx={{ "& > *": { borderBottom: "unset" } }}
                        hover
                      >
                        <TableCell>
                          <Switch
                            checked={product.active}
                            onChange={(e) =>
                              activeProduct(product.id, e.target.checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={product.promotional}
                            onChange={(e) =>
                              setPromoProduct(product.id, e.target.checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Avatar src={product.thumbnail || ""} />
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          <Button
                            fullWidth
                            endIcon={
                              isCollapesed.id === product.id &&
                              isCollapesed.open ? (
                                <FiChevronUp />
                              ) : (
                                <FiChevronDown />
                              )
                            }
                            onClick={() =>
                              setIsCollapsed({
                                id: product.id,
                                open:
                                  isCollapesed.id !== product.id
                                    ? true
                                    : !isCollapesed.open,
                              })
                            }
                            size="small"
                          >
                            {isCollapesed.id === product.id && isCollapesed.open
                              ? "Ocultar"
                              : "Mostrar"}
                          </Button>
                        </TableCell>
                        <TableCell sx={{ textAlign: "right", borderBottom: 0 }}>
                          {product.promotional ? (
                            <Stack
                              direction={"row"}
                              justifyContent={"end"}
                              spacing={1}
                            >
                              <Typography
                                variant="body2"
                                fontSize={"12px"}
                                sx={{ textDecoration: "line-through" }}
                              >
                                {formatCurrency(product.price)}
                              </Typography>
                              <Typography variant="body2">
                                {calcDiscount(
                                  Number(product.price),
                                  product.promo_rate
                                )}
                              </Typography>
                            </Stack>
                          ) : (
                            <>{formatCurrency(product.price)}</>
                          )}
                        </TableCell>
                        <TableCell>
                          <Stack
                            spacing={1}
                            direction="row"
                            justifyContent={"center"}
                          >
                            <Tooltip title="Editar" arrow>
                              <IconButton
                                color="primary"
                                size="small"
                                onClick={() =>
                                  navigate(
                                    `/dashboard/produtos/editar/${product.id}`
                                  )
                                }
                              >
                                <AiOutlineEdit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Alterar Imagem" arrow>
                              <IconButton
                                color="primary"
                                size="small"
                                onClick={() => handleEditProduct(product)}
                              >
                                <AiOutlinePicture />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={7} style={{ padding: 0 }}>
                          <Collapse
                            in={
                              isCollapesed.id === product.id &&
                              isCollapesed.open
                            }
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box p={2}>
                              <Card elevation={0} sx={{ bgcolor: grey["100"] }}>
                                <TabContext value={value}>
                                  <Box
                                    sx={{
                                      borderBottom: 1,
                                      borderColor: "divider",
                                    }}
                                  >
                                    <TabList
                                      onChange={handleChange}
                                      aria-label="product info"
                                    >
                                      <Tab label="Categorias" value="1" />
                                      <Tab label="Descrição" value="2" />
                                      <Tab label="Estoque" value="3" />
                                      <Tab label="Frete" value="4" />
                                    </TabList>
                                  </Box>
                                  <TabPanel value="1">
                                    <List dense>
                                      <ListItem>
                                        <ListItemIcon>
                                          <AiOutlineTag />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={product.category.name}
                                          secondary={"Categoria"}
                                        />
                                      </ListItem>
                                      <ListItem>
                                        <ListItemIcon>
                                          <HiOutlineCollection />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={product.collection.name}
                                          secondary={"Sub-categoria"}
                                        />
                                      </ListItem>
                                    </List>
                                  </TabPanel>
                                  <TabPanel value="2">
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: product.description,
                                      }}
                                    />
                                  </TabPanel>
                                  <TabPanel value="3">
                                    {(product.stock_type === "OFF" &&
                                      "VENDA SEM ESTOQUE") ||
                                      (product.stock_type === "CUSTOM" && (
                                        <List dense>
                                          {product.ProductOptions.map(
                                            (prodOpt) => (
                                              <ListItem key={prodOpt.id}>
                                                <ListItemAvatar>
                                                  <Avatar>
                                                    {prodOpt.headline}
                                                  </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                  primary={`Quantidade: ${prodOpt.stock}`}
                                                  secondary={`Ordem: ${prodOpt.content}`}
                                                />
                                              </ListItem>
                                            )
                                          )}
                                        </List>
                                      )) ||
                                      (product.stock_type === "UNITY" && (
                                        <span>
                                          <strong>Quantidade:</strong>{" "}
                                          {product.stock}
                                        </span>
                                      ))}
                                  </TabPanel>
                                  <TabPanel value="4">
                                    <List dense>
                                      <ListItem>
                                        <ListItemIcon>
                                          <BsTruck />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={
                                            product.freight_priority ===
                                            "NORMAL"
                                              ? "Entrega normal"
                                              : "Entrega rápida"
                                          }
                                          secondary={"Tipo de entrega"}
                                        />
                                      </ListItem>
                                      <ListItem>
                                        <ListItemIcon>
                                          <FiPackage />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={`${product.shipping_info.width} cm`}
                                          secondary={"Largura"}
                                        />
                                      </ListItem>
                                      <ListItem>
                                        <ListItemIcon>
                                          <FiPackage />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={`${product.shipping_info.height} cm`}
                                          secondary={"Altura"}
                                        />
                                      </ListItem>
                                      <ListItem>
                                        <ListItemIcon>
                                          <FiPackage />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={`${product.shipping_info.lenght} cm`}
                                          secondary={"Comprimento"}
                                        />
                                      </ListItem>
                                      <ListItem>
                                        <ListItemIcon>
                                          <FiPackage />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={`${product.shipping_info.weight} kg`}
                                          secondary={"Peso"}
                                        />
                                      </ListItem>
                                    </List>
                                  </TabPanel>
                                </TabContext>
                              </Card>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
                {products.length !== 0 && (
                  <>
                    {search !== "all" ? (
                      ""
                    ) : (
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={7} sx={{ borderBottom: "none" }}>
                            <Box
                              display={"flex"}
                              justifyContent="center"
                              mt={2}
                            >
                              <Button
                                onClick={() => handleMore()}
                                disabled={totalItems === products.length}
                              >
                                Mostrar mais
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    )}
                  </>
                )}
              </Table>
            </TableContainer>
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
            onFinish={handleCloseModal}
            old={productToupdate?.thumbnail || ""}
            oldId={productToupdate?.thumbnail_id || ""}
            id={productToupdate?.id || ""}
            to="product"
          />
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
