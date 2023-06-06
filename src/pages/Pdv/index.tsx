import { Fragment, useEffect, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import {
  Autocomplete,
  Backdrop,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { AiOutlineMinus, AiOutlinePlus, AiOutlineSave } from "react-icons/ai";
import InputText from "../../components/layout/InputText";
import IconButton from "../../components/layout/IconButton";
import { LoadingButton } from "@mui/lab";
import {
  FaDollarSign,
  FaSave,
  FaShoppingBag,
  FaShoppingCart,
} from "react-icons/fa";
import { GetAllClientsEntity } from "../../services/entities/clients";
import { ProductsWithRelationshipEntity } from "../../services/entities/products";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import formatCurrency from "../../helpers/formatCurrency";
import { blue, red } from "@mui/material/colors";
import { OrderItemsDto } from "../../services/dto/products";
import { ProductOptionsEntity } from "../../services/entities/productOptions";
import Swal from "sweetalert2";
import currencyMask from "../../helpers/currencyMask";
import Avatar from "../../components/layout/Avatar";
import { useNavigate } from "react-router-dom";
import calcDiscount from "../../helpers/calcPercentage";
import { HiOutlineTrash } from "react-icons/hi";
import getSuccessMessage from "../../helpers/getMessageSuccess";
import {
  MenuContainer,
  MenuItem,
  PdvContainer,
  ProductsContainer,
  ProductsList,
} from "./styles";

export default function PdvPage() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clients, setClients] = useState<GetAllClientsEntity[]>([]);
  const [products, setProducts] = useState<ProductsWithRelationshipEntity[]>(
    []
  );

  const [orderItems, setOrderItems] = useState<OrderItemsDto[]>([]);
  const [total, setTotal] = useState<number | string>(0);
  const [discount, setDiscount] = useState<number | string>(0);
  const [subTotal, setSubTotal] = useState<number | string>(0);
  const [selectedClient, setSelectedClient] =
    useState<GetAllClientsEntity | null>(null);
  const [selectectProduct, setSelectedProduct] =
    useState<ProductsWithRelationshipEntity | null>(null);
  const [productOptions, setProductOptions] = useState<ProductOptionsEntity[]>(
    []
  );
  const [quantity, setQuantity] = useState<string | number>(1);

  const [backdrop, setBackdrop] = useState<boolean>(false);

  function getProducts() {
    setBackdrop(true);
    api
      .get("/pdv/initial-data")
      .then((response) => {
        setClients(response.data.clients);
        setProducts(response.data.products);
        setBackdrop(false);
      })
      .catch((error) => {
        getErrorMessage({ error });
        setBackdrop(false);
      });
  }

  function cancel() {
    setOrderItems([]);
    getProducts();
    setQuantity(1);
    setDiscount(0);
    setSelectedClient(null);
    localStorage.removeItem("order");
  }

  function handleAddProduct(product: ProductsWithRelationshipEntity) {
    setSelectedProduct(product);
    const filter = orderItems.find((obj) => obj.product_id === product.id);

    if (filter) {
      Swal.fire({
        title: "Atenção",
        text: "Este item já foi adicionado!",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      setSelectedProduct(null);
      return;
    }

    if (product.stock_type !== "CUSTOM") {
      setOrderItems([
        ...orderItems,
        {
          id: product.id,
          price: product.promotional
            ? calcDiscount(
                product.price as number,
                product.promo_rate,
                "onlyNumber"
              )
            : product.price,
          product_id: product.id,
          product_name: product.name,
          product_options_id: null,
          product_options_label: "",
          quantity: quantity as number,
          actual_stock: product.stock as number,
          stock_type: product.stock_type || "",
          promo_rate: product.promotional ? product.promo_rate : null,
        },
      ]);

      setSelectedProduct(null);
    } else {
      setIsDialogOpen(true);
      setProductOptions(product.ProductOptions);

      setOrderItems([
        ...orderItems,
        {
          id: product.id,
          price: product.promotional
            ? calcDiscount(
                product.price as number,
                product.promo_rate,
                "onlyNumber"
              )
            : product.price,
          product_id: product.id,
          product_name: product.name,
          product_options_id: null,
          product_options_label: "",
          quantity: quantity as number,
          actual_stock: product.stock as number,
          stock_type: product.stock_type || "",
          promo_rate: product.promotional ? product.promo_rate : null,
        },
      ]);
    }
  }

  function handleAddProductOptions(option: ProductOptionsEntity) {
    const updated = orderItems.map((item) => {
      if (item.id === option.product_id) {
        return {
          ...item,
          product_options_id: option.id,
          product_options_label: option.headline,
          actual_stock: option.stock as number,
        };
      }
      return item;
    });
    setOrderItems(updated);
    setSelectedProduct(null);
    setIsDialogOpen(false);
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
        localStorage.setItem("order", JSON.stringify(results));
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
          item.quantity >= item.actual_stock &&
          mode === "add"
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

  function addDiscount(value: string) {
    if (Number(value) < 0) {
      Swal.fire({
        title: "Atenção",
        text: "O valor do desconto não pode ser menor que 0",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    setDiscount(value);
    const parsedValue = parseFloat(
      total.toString().replace(".", "").replace(",", ".")
    );
    const dicounted = Number(value) / 100;
    const calcDiscount = parsedValue - parsedValue * dicounted;
    setSubTotal(
      formatCurrency(calcDiscount.toFixed(2), "withoutSign") as string
    );
  }

  function createOrder() {
    if (!selectedClient) {
      Swal.fire({
        title: "Atenção",
        text: "Por favor selecione um cliente!",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (!orderItems) {
      Swal.fire({
        title: "Atenção",
        text: "Por favor adicione pelo menos um produto!",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    setIsLoading(true);

    api
      .post("/orders/create", {
        order: {
          total: parseFloat(
            total.toString().replace(".", "").replace(",", ".")
          ),
          order_from: "PDV",
          client_id: selectedClient.id,
          discount: Number(discount),
          sub_total: parseFloat(
            subTotal.toString().replace(".", "").replace(",", ".")
          ),
          month: new Intl.DateTimeFormat("pt-BR", {
            month: "long",
          }).format(new Date()),
          year: new Intl.DateTimeFormat("pt-BR", {
            year: "numeric",
          })
            .format(new Date())
            .toString(),
        },
        orderItems,
      })
      .then((response) => {
        Swal.fire({
          title: "Sucesso",
          text: `${response.data.message}, deseja prosseguir para o pagamento?`,
          icon: "success",
          showDenyButton: true,
          denyButtonText: "Não",
          denyButtonColor: red["600"],
          confirmButtonText: "Sim",
          confirmButtonColor: blue["500"],
        }).then((result) => {
          setIsLoading(false);
          if (result.isConfirmed) {
            localStorage.removeItem("order");
            navigate(`/dashboard/vendas/checkout/${response.data.id}`);
          }
        });
      })
      .catch((error) => {
        setIsLoading(false);
        getErrorMessage({ error });
      });
  }

  function saveOrderAsDraft() {
    if (!selectedClient) {
      Swal.fire({
        title: "Atenção",
        text: "Por favor selecione um cliente!",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (!orderItems) {
      Swal.fire({
        title: "Atenção",
        text: "Por favor adicione pelo menos um produto!",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }

    Swal.fire({
      title: "Confirmação",
      text: `Deseja salvar esta compra?`,
      icon: "question",
      showDenyButton: true,
      denyButtonText: "Não",
      denyButtonColor: red["600"],
      confirmButtonText: "Sim",
      confirmButtonColor: blue["500"],
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return api
          .post("/orders/save-as-draft", {
            order: {
              total: parseFloat(
                total.toString().replace(".", "").replace(",", ".")
              ),
              order_from: "PDV",
              client_id: selectedClient.id,
              discount: Number(discount),
              sub_total: parseFloat(
                subTotal.toString().replace(".", "").replace(",", ".")
              ),
              month: new Intl.DateTimeFormat("pt-BR", {
                month: "long",
              }).format(new Date()),
              year: new Intl.DateTimeFormat("pt-BR", {
                year: "numeric",
              })
                .format(new Date())
                .toString(),
            },
            orderItems,
          })
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            getErrorMessage({ error });
          });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        getSuccessMessage({ message: result.value.message });
        cancel();
      }
    });
  }

  useEffect(() => {
    if (selectectProduct) {
      handleAddProduct(selectectProduct);
    }
  }, [selectectProduct]);

  useEffect(() => {
    getProducts();
    const items = localStorage.getItem("order");
    items && setOrderItems(JSON.parse(items));
  }, []);

  useEffect(() => {
    const sum = orderItems.reduce(
      (partialSum, a) => partialSum + Number(a.price) * a.quantity,
      0
    );
    setTotal(currencyMask(formatCurrency(sum, "withoutSign") as string));
    setSubTotal(currencyMask(formatCurrency(sum, "withoutSign") as string));

    if (orderItems.length) {
      localStorage.setItem("order", JSON.stringify(orderItems));
    }
  }, [orderItems]);

  return (
    <Fragment>
      <AppBar title="Balcão de vendas" />
      <Container>
        <PdvContainer>
          <MenuContainer>
            <MenuItem active={true}>
              <FaShoppingCart className="menu-icon" />
              <div className="menu-right">
                <span className="menu-title">BALCÃO</span>
                <span className="menu-desc">DE VENDAS</span>
              </div>
            </MenuItem>
            <MenuItem
              active={false}
              onClick={() => navigate("/dashboard/vendas/finalizadas")}
            >
              <FaShoppingBag className="menu-icon" />
              <div className="menu-right">
                <span className="menu-title">VENDAS</span>
                <span className="menu-desc">FINALIZADAS</span>
              </div>
            </MenuItem>
            <MenuItem
              active={false}
              onClick={() => navigate("/dashboard/vendas/salvas")}
            >
              <FaSave className="menu-icon" />
              <div className="menu-right">
                <span className="menu-title">VENDAS</span>
                <span className="menu-desc">SALVAS</span>
              </div>
            </MenuItem>
          </MenuContainer>

          <Box
            borderRadius={"4px"}
            p={1}
            boxShadow={"0px 0px 9px rgba(0, 0, 0, 0.05)"}
            bgcolor={"#FFF"}
            zIndex={1}
          >
            <Autocomplete
              disablePortal
              id="products_name"
              options={products}
              renderInput={(params) => (
                <InputText
                  {...params}
                  label="Busque por nome ou código"
                  fullWidth
                />
              )}
              getOptionLabel={(option) =>
                `${option.name} - ${option.code || ""}`
              }
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Avatar
                    sx={{ width: 24, height: 24, mr: 2 }}
                    src={option.thumbnail || ""}
                  />
                  <Typography variant="body1">{option.name}</Typography>
                </Box>
              )}
              noOptionsText="Nenhum produto encontrado"
              value={selectectProduct}
              onChange={(_, newValue) =>
                setSelectedProduct(newValue as ProductsWithRelationshipEntity)
              }
              ListboxProps={{ sx: { zIndex: 10000 } }}
            />
          </Box>

          <ProductsContainer flex={1}>
            <ProductsList>
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
                      <TableCell sx={{ fontSize: "13px", minWidth: "230px" }}>
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
                          <Stack
                            spacing={1}
                            direction={"row"}
                            alignItems={"center"}
                          >
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() =>
                                handleQuantity(orderItem.id, "minus")
                              }
                            >
                              <AiOutlineMinus />
                            </IconButton>
                            <Box
                              minWidth={30}
                              height={25}
                              bgcolor={blue["50"]}
                              display={"flex"}
                              justifyContent={"center"}
                              alignItems={"center"}
                              borderRadius={"4px"}
                              fontSize={"11px"}
                            >
                              {orderItem.quantity}
                            </Box>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() =>
                                handleQuantity(orderItem.id, "add")
                              }
                            >
                              <AiOutlinePlus />
                            </IconButton>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ fontSize: "13px", width: "140px" }}>
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
                          {orderItem.promo_rate !== null ? (
                            <Stack
                              direction={"row"}
                              alignItems={"center"}
                              spacing={1}
                              justifyContent={"flex-end"}
                            >
                              <Chip
                                label={`-${orderItem.promo_rate}%`}
                                size="small"
                                color="error"
                              />
                              <Typography variant="body2" fontSize={"13px"}>
                                {formatCurrency(orderItem.price)}
                              </Typography>
                            </Stack>
                          ) : (
                            formatCurrency(orderItem.price)
                          )}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "13px",
                            width: "40px",
                            textAlign: "right",
                          }}
                        >
                          {formatCurrency(
                            Number(orderItem.price) * Number(orderItem.quantity)
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
                            <HiOutlineTrash />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </ProductsList>
          </ProductsContainer>

          <Box
            borderRadius={"4px"}
            p={1}
            boxShadow={"0px 0px 9px rgba(0, 0, 0, 0.05)"}
            bgcolor={"#FFF"}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
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
                  noOptionsText="Nenhum cliente encontrado"
                />
              </Grid>
              <Grid item xs={4}>
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
              <Grid item xs={4}>
                <InputText
                  label="Desconto"
                  value={discount}
                  onChange={(e) => addDiscount(e.target.value)}
                  fullWidth
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">%</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <InputText
                  label="Sub-total"
                  value={subTotal}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <LoadingButton
                  color="error"
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<HiOutlineTrash />}
                  onClick={cancel}
                >
                  Cancelar
                </LoadingButton>
              </Grid>
              <Grid item xs={4}>
                <LoadingButton
                  fullWidth
                  color="info"
                  variant="contained"
                  size="large"
                  startIcon={<AiOutlineSave />}
                  onClick={saveOrderAsDraft}
                >
                  Salvar
                </LoadingButton>
              </Grid>
              <Grid item xs={4}>
                <LoadingButton
                  fullWidth
                  color="success"
                  variant="contained"
                  size="large"
                  startIcon={<FaDollarSign />}
                  loading={isLoading}
                  onClick={createOrder}
                >
                  Finalizar
                </LoadingButton>
              </Grid>
            </Grid>
          </Box>
        </PdvContainer>
      </Container>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" fontSize={15}>
          Selecione uma opção
        </DialogTitle>
        <DialogContent>
          <Box display={"flex"} gap={2} flexWrap={"wrap"}>
            {productOptions.map((opt) => (
              <IconButton
                key={opt.id}
                disabled={Number(opt.stock) <= 0 ? true : false}
                size="large"
                onClick={() => handleAddProductOptions(opt)}
              >
                {opt.headline}
              </IconButton>
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Fragment>
  );
}
