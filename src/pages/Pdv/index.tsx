import { Fragment, MouseEvent, useEffect, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import {
  Autocomplete,
  Box,
  ButtonGroup,
  Chip,
  Divider,
  Grid,
  InputAdornment,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  AiOutlineMinus,
  AiOutlinePicture,
  AiOutlinePlus,
  AiOutlineSave,
  AiOutlineShoppingCart,
  AiOutlineTags,
} from "react-icons/ai";
import InputText from "../../components/layout/InputText";
import IconButton from "../../components/layout/IconButton";
import { BsTrash } from "react-icons/bs";
import { LoadingButton } from "@mui/lab";
import { FaBoxOpen, FaDollarSign } from "react-icons/fa";
import { GetAllClientsEntity } from "../../services/entities/clients";
import { ProductsWithRelationshipEntity } from "../../services/entities/products";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import Loading from "../../components/layout/Loading";
import formatCurrency from "../../helpers/formatCurrency";
import { CardImage, ProductCard, ProductsGrid } from "./styles";
import { blue, grey, red } from "@mui/material/colors";
import Button from "../../components/layout/Button";
import { OrderItemsDto } from "../../services/dto/products";
import { ProductOptionsEntity } from "../../services/entities/productOptions";
import Swal from "sweetalert2";
import currencyMask from "../../helpers/currencyMask";

export default function PdvPage() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clients, setClients] = useState<GetAllClientsEntity[]>([]);
  const [initialProducts, setInitialProducts] = useState<
    ProductsWithRelationshipEntity[]
  >([]);
  const [products, setProducts] = useState<ProductsWithRelationshipEntity[]>(
    []
  );
  const [orderItems, setOrderItems] = useState<OrderItemsDto[]>([]);
  const [total, setTotal] = useState<number | string>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [subTotal, setSubTotal] = useState<number | string>(0);
  const [selectedClient, setSelectedClient] =
    useState<GetAllClientsEntity | null>(null);
  const [productOptions, setProductOptions] = useState<ProductOptionsEntity[]>(
    []
  );

  const handleClick = (
    event: MouseEvent<HTMLButtonElement>,
    options: ProductOptionsEntity[]
  ) => {
    setAnchorEl(event.currentTarget);
    setProductOptions(options);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function getProducts() {
    setIsLoading(true);
    api
      .get("/pdv/initial-data")
      .then((response) => {
        setIsLoading(false);
        setClients(response.data.clients);
        setInitialProducts(response.data.products);
        setProducts(response.data.products);
      })
      .catch((error) => {
        setIsLoading(false);
        getErrorMessage({ error });
      });
  }

  function cancel() {
    setOrderItems([]);
    setSearch("");
    getProducts();
  }

  function searchProducts(text: string) {
    setSearch(text);
    if (text.length > 1) {
      api
        .post("/pdv/search-products", {
          name: text,
        })
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          getErrorMessage({ error });
        });
    }
    if (text === "") {
      setProducts(initialProducts);
    }
  }

  function handleAddProduct(
    product: ProductsWithRelationshipEntity,
    option?: ProductOptionsEntity
  ) {
    const filter = orderItems.find((obj) => obj.product_id === product.id);

    if (filter) {
      Swal.fire({
        title: "Atenção",
        text: "Este item já foi adicionado!",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }

    setOrderItems([
      ...orderItems,
      {
        id: Math.random().toString(),
        price: product.price,
        product_id: product.id,
        product_name: product.name,
        product_options_id: option ? option.id : null,
        product_options_label: option ? option.headline : "",
        quantity: 1,
        actual_stock: product.stock as number,
        stock_type: product.stock_type || "",
      },
    ]);
  }

  function removeProduct(id: string) {
    Swal.fire({
      title: "Confirmação",
      text: "Deseja remover este item?",
      icon: "question",
      showDenyButton: true,
      denyButtonText: "Não",
      denyButtonColor: red["600"],
      confirmButtonText: "Sim",
      confirmButtonColor: blue["500"],
    }).then((result) => {
      if (result.isConfirmed) {
        const results = orderItems.filter((obj) => obj.id !== id);
        setOrderItems(results);
      }
    });
  }

  function handleQuantity(id: string, mode: "add" | "minus") {
    const updated = orderItems.map((item) => {
      if (item.id === id) {
        if (item.quantity <= 1 && mode === "minus") {
          Swal.fire({
            title: "Atenção",
            text: "A quantidade não pode ser menor que 0!",
            icon: "warning",
            confirmButtonColor: blue["500"],
          });
        } else if (
          item.stock_type !== "OFF" &&
          item.quantity >= item.actual_stock
        ) {
          Swal.fire({
            title: "Atenção",
            text: "Este produto não tem esta quantidade em estoque!",
            icon: "warning",
            confirmButtonColor: blue["500"],
          });
        } else {
          return {
            ...item,
            quantity: mode === "add" ? item.quantity + 1 : item.quantity - 1,
          };
        }
      }
      return item;
    });
    setOrderItems(updated);
  }

  function handleSubTotal(value: string) {
    setSubTotal(currencyMask(value));
  }

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    const sum = orderItems.reduce(
      (partialSum, a) => partialSum + Number(a.price) * a.quantity,
      0
    );
    setTotal(currencyMask(formatCurrency(sum, "withoutSign") as string));
    setSubTotal(currencyMask(formatCurrency(sum, "withoutSign") as string));
  }, [orderItems]);

  return (
    <Fragment>
      <AppBar title="Balcão de vendas" />
      <Box pb={"20px"}>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12} mt={"20px"}>
              <DefaultContainer disabledPadding>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  gap={1}
                  flexWrap={"wrap"}
                >
                  <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <AiOutlineTags fontSize={18} />
                    <Typography variant="subtitle1" fontWeight={"bold"}>
                      PRODUTOS
                    </Typography>
                  </Stack>

                  <InputText
                    label="Busque por nome ou código"
                    fullWidth
                    sx={{ maxWidth: "400px" }}
                    value={search}
                    onChange={(e) => searchProducts(e.target.value)}
                  />
                </Box>
                <Divider sx={{ my: 1 }} />
                {isLoading ? (
                  <Loading />
                ) : (
                  <ProductsGrid>
                    {products.map((product) => (
                      <ProductCard key={product.id}>
                        {!product.thumbnail ? (
                          <Box
                            sx={{ aspectRatio: "16 / 9" }}
                            display={"flex"}
                            width={"100%"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            bgcolor={"#fff"}
                            fontSize={"50px"}
                            color={grey["800"]}
                            borderBottom={`1px solid ${grey["300"]}`}
                          >
                            <AiOutlinePicture />
                          </Box>
                        ) : (
                          <CardImage src={product.thumbnail} />
                        )}
                        <Box
                          padding={"3px 10px"}
                          flexDirection={"column"}
                          display={"flex"}
                          color={grey["800"]}
                        >
                          <Typography
                            variant="caption"
                            sx={{ mt: 1, fontSize: 10 }}
                            textTransform={"uppercase"}
                          >
                            {product.name}
                          </Typography>
                          <Typography variant="body2" fontWeight={"bold"}>
                            {formatCurrency(product.price)}
                          </Typography>
                        </Box>
                        <Box
                          borderTop={`1px solid ${grey["300"]}`}
                          padding={0.5}
                        >
                          <Button
                            size="small"
                            startIcon={<AiOutlineShoppingCart />}
                            variant="text"
                            fullWidth
                            aria-describedby={id}
                            onClick={
                              product.stock_type === "CUSTOM"
                                ? (e) =>
                                    handleClick(
                                      e as MouseEvent<HTMLButtonElement>,
                                      product.ProductOptions
                                    )
                                : () => handleAddProduct(product)
                            }
                          >
                            Adiconar
                          </Button>
                        </Box>
                      </ProductCard>
                    ))}
                  </ProductsGrid>
                )}
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  PaperProps={{ style: { maxWidth: "200px" }, elevation: 3 }}
                >
                  <Box
                    display={"flex"}
                    gap={2}
                    flexWrap={"wrap"}
                    padding={"10px"}
                  >
                    {productOptions.map((option) => (
                      <IconButton
                        color="primary"
                        disabled={Number(option.stock) <= 0}
                        sx={{ flexShrink: 0 }}
                        key={option.id}
                        size="small"
                      >
                        {option.headline}
                      </IconButton>
                    ))}
                  </Box>
                </Popover>
              </DefaultContainer>
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} lg={8}>
              <DefaultContainer disabledPadding>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  gap={1}
                  flexWrap={"wrap"}
                >
                  <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <AiOutlineTags fontSize={18} />
                    <Typography variant="subtitle1" fontWeight={"bold"}>
                      PRODUTOS SELECIONADOS
                    </Typography>
                  </Stack>
                </Box>
                <Divider sx={{ my: 1 }} />
                {orderItems.length !== 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontSize: "13px",
                              width: "1%",
                              textAlign: "center",
                            }}
                          >
                            Qtd.
                          </TableCell>
                          <TableCell sx={{ fontSize: "13px", width: "140px" }}>
                            Produto
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "13px",
                              width: "40px",
                              textAlign: "center",
                            }}
                          >
                            Opções
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "13px",
                              width: "40px",
                              textAlign: "right",
                            }}
                          >
                            Preço
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "13px",
                              width: "40px",
                              textAlign: "right",
                            }}
                          >
                            Total
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "13px",
                              width: "40px",
                              textAlign: "center",
                            }}
                          >
                            Ações
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((orderItem) => (
                          <TableRow hover key={orderItem.id}>
                            <TableCell sx={{ fontSize: "13px", width: "1%" }}>
                              <ButtonGroup size="small">
                                <Button
                                  variant="outlined"
                                  onClick={() =>
                                    handleQuantity(orderItem.id, "minus")
                                  }
                                >
                                  <AiOutlineMinus />
                                </Button>
                                <Button variant="outlined">
                                  {orderItem.quantity}
                                </Button>
                                <Button
                                  variant="outlined"
                                  onClick={() =>
                                    handleQuantity(orderItem.id, "add")
                                  }
                                >
                                  <AiOutlinePlus />
                                </Button>
                              </ButtonGroup>
                            </TableCell>
                            <TableCell
                              sx={{ fontSize: "13px", width: "140px" }}
                            >
                              {orderItem.product_name}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "13px",
                                width: "40px",
                                textAlign: "center",
                              }}
                            >
                              {orderItem.product_options_id ? (
                                <Chip label={orderItem.product_options_label} />
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "13px",
                                width: "40px",
                                textAlign: "right",
                              }}
                            >
                              {formatCurrency(orderItem.price)}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "13px",
                                width: "40px",
                                textAlign: "right",
                              }}
                            >
                              {formatCurrency(
                                Number(orderItem.price) *
                                  Number(orderItem.quantity)
                              )}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "13px",
                                width: "40px",
                                textAlign: "center",
                              }}
                            >
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => removeProduct(orderItem.id)}
                              >
                                <BsTrash />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box
                    color={grey["700"]}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexDirection={"column"}
                    padding={"20px"}
                    gap={"5px"}
                  >
                    <FaBoxOpen fontSize={40} />
                    <Typography variant="body2" sx={{ userSelect: "none" }}>
                      Nenhum item selecionado
                    </Typography>
                  </Box>
                )}
              </DefaultContainer>
            </Grid>
            <Grid item xs={12} lg={4}>
              <DefaultContainer disabledPadding>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={clients}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <InputText
                      {...params}
                      label="Selecione o cliente"
                      fullWidth
                    />
                  )}
                  value={selectedClient}
                  onChange={(_, newValue) => setSelectedClient(newValue)}
                />
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <InputText
                      label="Total"
                      value={total}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">R$</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputText
                      label="Desconto"
                      value={discount}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">%</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <InputText
                      label="Sub-total"
                      value={subTotal}
                      onChange={(e) => handleSubTotal(e.target.value)}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">R$</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6} md={4} lg={6}>
                    <LoadingButton
                      color="error"
                      variant="contained"
                      fullWidth
                      size="large"
                      startIcon={<BsTrash />}
                      onClick={cancel}
                    >
                      Cancelar
                    </LoadingButton>
                  </Grid>
                  <Grid item xs={6} md={4} lg={6}>
                    <LoadingButton
                      fullWidth
                      color="info"
                      variant="contained"
                      size="large"
                      startIcon={<AiOutlineSave />}
                    >
                      Salvar
                    </LoadingButton>
                  </Grid>
                  <Grid item xs={12} md={4} lg={12}>
                    <LoadingButton
                      fullWidth
                      color="success"
                      variant="contained"
                      size="large"
                      startIcon={<FaDollarSign />}
                    >
                      Pagamento
                    </LoadingButton>
                  </Grid>
                </Grid>
              </DefaultContainer>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Fragment>
  );
}
