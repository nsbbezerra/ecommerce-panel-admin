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
  AiOutlineMinus,
  AiOutlinePicture,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineTag,
} from "react-icons/ai";
import { BsArchive, BsTruck } from "react-icons/bs";
import { FiPackage } from "react-icons/fi";
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
import Upload from "../../components/layout/Upload";
import { blue, grey, red } from "@mui/material/colors";
import getSuccessMessage from "../../helpers/getMessageSuccess";
import Swal from "sweetalert2";
import calcDiscount from "../../helpers/calcPercentage";
import EmptyBox from "../../components/layout/EmptyBox";
import { MdOutlineDescription, MdOutlineLocalShipping } from "react-icons/md";

interface CollapsedProps {
  id: string;
  open: boolean;
}

export default function ProductsPage() {
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
      setIsLoading(true);
      setPage(actualPage);
      const paginate = actualPage * configs.paginationItems;
      api
        .get(`/products/get-all/${paginate}/${configs.paginationItems}`)
        .then((response) => {
          setIsLoading(false);
          setProducts(response.data.products);
          console.log(response.data.products);
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
      preConfirm: (value) => {
        return api
          .put("/products/update", {
            product: {
              id,
              promotional: promo,
              promo_rate: Number(value),
            },
          })
          .then((response) => {
            return response.data;
          })
          .catch((error) => getErrorMessage({ error }));
      },
    }).then((results) => {
      if (results.isConfirmed) {
        getSuccessMessage({ message: results.value.message });
        getAllProducts(0);
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

        <DefaultContainer disablePaddingInside>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {products.length === 0 ? (
                <EmptyBox label="Nenhuma informação encontrada" />
              ) : (
                <TableContainer sx={{ py: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            width: "1px",
                            minWidth: "1px",
                            maxWidth: "1px",
                          }}
                        >
                          Detalhes
                        </TableCell>
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
                        <TableCell
                          sx={{ minWidth: "120px", textAlign: "right" }}
                        >
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
                            <TableCell
                              sx={{ textAlign: "center", borderBottom: 0 }}
                            >
                              <IconButton
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
                                color="primary"
                              >
                                {isCollapesed.id === product.id &&
                                isCollapesed.open ? (
                                  <AiOutlineMinus />
                                ) : (
                                  <AiOutlinePlus />
                                )}
                              </IconButton>
                            </TableCell>
                            <TableCell sx={{ borderBottom: 0 }}>
                              <Switch
                                checked={product.active}
                                onChange={(e) =>
                                  activeProduct(product.id, e.target.checked)
                                }
                              />
                            </TableCell>
                            <TableCell sx={{ borderBottom: 0 }}>
                              <Switch
                                checked={product.promotional}
                                onChange={(e) =>
                                  setPromoProduct(product.id, e.target.checked)
                                }
                              />
                            </TableCell>
                            <TableCell sx={{ borderBottom: 0 }}>
                              <Avatar src={product.thumbnail || ""} />
                            </TableCell>
                            <TableCell sx={{ borderBottom: 0 }}>
                              {product.name}
                            </TableCell>
                            <TableCell
                              sx={{ textAlign: "right", borderBottom: 0 }}
                            >
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
                            <TableCell sx={{ borderBottom: 0 }}>
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
                                <Box p={1}>
                                  <Card
                                    elevation={0}
                                    sx={{ bgcolor: grey["100"], p: 2 }}
                                  >
                                    <Box
                                      bgcolor={"#FFF"}
                                      borderRadius={"4px"}
                                      overflow={"hidden"}
                                    >
                                      <Stack
                                        direction={"row"}
                                        spacing={2}
                                        alignItems={"center"}
                                        bgcolor={blue["100"]}
                                        color={blue["700"]}
                                        px={2}
                                        py={1}
                                      >
                                        <AiOutlineTag />
                                        <Typography
                                          variant="body2"
                                          fontWeight={"600"}
                                        >
                                          CATEGORIAS
                                        </Typography>
                                      </Stack>

                                      <Grid container spacing={2} p={2}>
                                        <Grid item xs={4}>
                                          <Stack spacing={1}>
                                            <Typography
                                              color={grey["600"]}
                                              variant="body1"
                                            >
                                              Categoria
                                            </Typography>
                                            <Typography fontWeight={"500"}>
                                              {product?.category?.name || "-"}
                                            </Typography>
                                          </Stack>
                                        </Grid>

                                        <Grid item xs={4}>
                                          <Stack spacing={1}>
                                            <Typography
                                              color={grey["600"]}
                                              variant="body1"
                                            >
                                              Sub-Categoria
                                            </Typography>
                                            <Typography fontWeight={"500"}>
                                              {product?.collection?.name || "-"}
                                            </Typography>
                                          </Stack>
                                        </Grid>

                                        <Grid item xs={4}>
                                          <Stack spacing={1}>
                                            <Typography
                                              color={grey["600"]}
                                              variant="body1"
                                            >
                                              Marca
                                            </Typography>
                                            <Typography fontWeight={"500"}>
                                              {product?.supplier?.name || "-"}
                                            </Typography>
                                          </Stack>
                                        </Grid>
                                      </Grid>
                                    </Box>

                                    <Box
                                      bgcolor={"#FFF"}
                                      borderRadius={"4px"}
                                      overflow={"hidden"}
                                      mt={2}
                                    >
                                      <Stack
                                        direction={"row"}
                                        spacing={2}
                                        alignItems={"center"}
                                        bgcolor={blue["100"]}
                                        color={blue["700"]}
                                        px={2}
                                        py={1}
                                      >
                                        <MdOutlineDescription />
                                        <Typography
                                          variant="body2"
                                          fontWeight={"600"}
                                        >
                                          DESCRIÇÃO
                                        </Typography>
                                      </Stack>

                                      <Box
                                        py={2}
                                        px={4}
                                        dangerouslySetInnerHTML={{
                                          __html: product.description,
                                        }}
                                      />
                                    </Box>

                                    <Box
                                      bgcolor={"#FFF"}
                                      borderRadius={"4px"}
                                      overflow={"hidden"}
                                      mt={2}
                                    >
                                      <Stack
                                        direction={"row"}
                                        spacing={2}
                                        alignItems={"center"}
                                        bgcolor={blue["100"]}
                                        color={blue["700"]}
                                        px={2}
                                        py={1}
                                      >
                                        <BsArchive />
                                        <Typography
                                          variant="body2"
                                          fontWeight={"600"}
                                        >
                                          ESTOQUE
                                        </Typography>
                                      </Stack>

                                      <Box p={2}>
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
                                      </Box>
                                    </Box>

                                    <Box
                                      bgcolor={"#FFF"}
                                      borderRadius={"4px"}
                                      overflow={"hidden"}
                                      mt={2}
                                    >
                                      <Stack
                                        direction={"row"}
                                        spacing={2}
                                        alignItems={"center"}
                                        bgcolor={blue["100"]}
                                        color={blue["700"]}
                                        px={2}
                                        py={1}
                                      >
                                        <MdOutlineLocalShipping />
                                        <Typography
                                          variant="body2"
                                          fontWeight={"600"}
                                        >
                                          FRETE
                                        </Typography>
                                      </Stack>

                                      <Box p={2}>
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
                                      </Box>
                                    </Box>
                                  </Card>
                                </Box>
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
          {products.length !== 0 && (
            <>
              {search !== "all" ? (
                ""
              ) : (
                <Box display={"flex"} justifyContent="center" pb={1}>
                  <Button
                    onClick={() => handleMore()}
                    disabled={totalItems === products.length}
                  >
                    Mostrar mais
                  </Button>
                </Box>
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
