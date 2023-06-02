import {
  Autocomplete,
  Box,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import AppBar from "../../components/layout/AppBar";
import Button from "../../components/layout/Button";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import InputText from "../../components/layout/InputText";
import RichEditor from "../../components/layout/RichEditor";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineSave,
} from "react-icons/ai";
import IconButton from "../../components/layout/IconButton";
import Avatar from "../../components/layout/Avatar";
import { FaTrash } from "react-icons/fa";
import Upload from "../../components/layout/Upload";
import { ProductOptionsDto, ProductsDto } from "../../services/dto/products";
import { api } from "../../configs/api";
import { CategoriesEntity } from "../../services/entities/categories";
import getErrorMessage from "../../helpers/getMessageError";
import { CollectionsEntity } from "../../services/entities/collections";
import currencyMask from "../../helpers/currencyMask";
import { ProductOptionsEntity } from "../../services/entities/productOptions";
import Swal from "sweetalert2";
import { blue, red } from "@mui/material/colors";
import { SupplierEntity } from "../../services/entities/supplier";
import generateSlug from "../../helpers/generateSlug";

interface FormTypeProps {
  type: "add" | "edit";
}

export default function SaveProduct() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });
  const { product } = useParams();
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const [formType, setFormType] = useState<FormTypeProps>({ type: "add" });
  const [categories, setCategories] = useState<CategoriesEntity[]>([]);
  const [collections, setCollections] = useState<CollectionsEntity[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<
    CollectionsEntity[]
  >([]);
  const [suppliers, setSuppliers] = useState<SupplierEntity[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesEntity | null>(null);
  const [selectedCollection, setSelectedCollection] =
    useState<CollectionsEntity | null>(null);
  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierEntity | null>(null);

  const [productForm, setProductForm] = useState<ProductsDto>({
    active: true,
    freight_priority: "NORMAL",
    code: "",
    category_id: null,
    collection_id: null,
    supplier_id: null,
    name: "",
    price: "",
    shipping_info: {
      height: 0,
      lenght: 0,
      weight: 0,
      width: 0,
    },
    short_description: "",
    slug: "",
    stock_type: "OFF",
    stock: 0,
  });

  const [productOptionForm, setProductOptionForm] = useState<ProductOptionsDto>(
    {
      content: "",
      headline: "",
      stock: 0,
      active: true,
    }
  );

  const [productId, setProductId] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [productsOptions, setProductsOptions] = useState<
    ProductOptionsEntity[]
  >([]);

  const [productOptStock, setProductOptStock] = useState<number>(0);
  const [productOptId, setProductOptId] = useState<string>("");

  function getFormData() {
    api
      .get("/products/form-data")
      .then((response) => {
        setCategories(response.data.categories);
        setCollections(response.data.collections);
        setSuppliers(response.data.suppliers);
      })
      .catch((error) => getErrorMessage({ error }));
  }

  function handleChangeCategory(category: CategoriesEntity) {
    setSelectedCategory(category);
    const result = collections.filter((obj) => obj.category_id === category.id);
    setFilteredCollections(result);
    setProductForm({ ...productForm, category_id: category.id });
  }

  function handleChangeCollection(collection: CollectionsEntity) {
    setSelectedCollection(collection);
    setProductForm({ ...productForm, collection_id: collection.id });
  }

  function handleChangeSupplier(supplier: SupplierEntity) {
    setSelectedSupplier(supplier);
    setProductForm({ ...productForm, supplier_id: supplier.id });
  }

  function addProductOptions(mode: "add" | "edit") {
    if (!productOptionForm.headline.length) {
      Swal.fire({
        title: "Atenção",
        text: "A descrição é obrigatória",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (!productOptionForm.content.length) {
      Swal.fire({
        title: "Atenção",
        text: "A ordem é obrigatória",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (
      productsOptions.find((obj) => obj.headline === productOptionForm.headline)
    ) {
      Swal.fire({
        title: "Atenção",
        text: "Já existe um com a mesma descrição",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (
      productsOptions.find((obj) => obj.content === productOptionForm.content)
    ) {
      Swal.fire({
        title: "Atenção",
        text: "Já existe um com a mesma ordem",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (mode === "add") {
      setProductsOptions([
        ...productsOptions,
        {
          content: productOptionForm.content,
          headline: productOptionForm.headline,
          stock: productOptionForm.stock,
          id: Math.random().toString(),
          active: true,
        },
      ]);

      setProductOptionForm({
        content: "",
        headline: "",
        stock: 0,
        active: true,
      });
    }
  }

  function removeProductOptions(id: string, mode: "add" | "edit") {
    if (mode === "add") {
      const results = productsOptions.filter((obj) => obj.id !== id);
      setProductsOptions(results);
    }
  }

  function saveProduct() {
    if (!productForm.name.length) {
      Swal.fire({
        title: "Atenção",
        text: "Insira um nome para o produto",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (!productForm.freight_priority.length) {
      Swal.fire({
        title: "Atenção",
        text: "Selecione um modo de entrega",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (productForm.stock_type === "") {
      Swal.fire({
        title: "Atenção",
        text: "Selecione um tipo de estoque",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (productForm.stock_type === "CUSTOM" && !productsOptions.length) {
      Swal.fire({
        title: "Atenção",
        text: "Insira pelo menos uma opção de estoque",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }

    if (formType.type === "add") {
      setIsLoading(true);
      api
        .post("/products/save", {
          product: {
            name: productForm.name,
            slug: generateSlug(productForm.name),
            active: productForm.active,
            short_description: productForm.short_description,
            description: editor?.getHTML(),
            price: productForm.price
              .toString()
              .replace(".", "")
              .replace(",", "."),
            shipping_info: {
              width: productForm.shipping_info.width,
              lenght: productForm.shipping_info.lenght,
              height: productForm.shipping_info.height,
              weight: productForm.shipping_info.weight,
            },
            freight_priority: productForm.freight_priority,
            category_id: productForm.category_id,
            collection_id: productForm.collection_id,
            stock_type: productForm.stock_type,
            supplier_id: productForm.supplier_id,
            stock: productForm.stock,
            code: productForm.code,
          },
          productOptions: productsOptions.map((prodOpt) => {
            return {
              headline: prodOpt.headline,
              content: prodOpt.content,
              stock: prodOpt.stock,
              active: prodOpt.active,
            };
          }),
        })
        .then((response) => {
          setProductId(response.data.productId),
            Swal.fire({
              title: "Sucesso!",
              text: `${response.data.message}, agora deseja inserir uma foto para esta categoria?`,
              icon: "success",
              showDenyButton: true,
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonText: "Sim",
              denyButtonText: "Não",
              confirmButtonColor: blue["500"],
              denyButtonColor: red["500"],
            }).then((result) => {
              if (result.isDenied) {
                navigate("/dashboard/produtos");
              }
            });
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          getErrorMessage({ error });
        });
    } else {
      setIsLoading(true);
      api
        .put("/products/update", {
          product: {
            id: product,
            name: productForm.name,
            code: productForm.code,
            slug: generateSlug(productForm.name),
            active: productForm.active,
            short_description: productForm.short_description,
            description: editor?.getHTML(),
            price: productForm.price
              .toString()
              .replace(".", "")
              .replace(",", "."),
            shipping_info: {
              width: productForm.shipping_info.width,
              lenght: productForm.shipping_info.lenght,
              height: productForm.shipping_info.height,
              weight: productForm.shipping_info.weight,
            },
            freight_priority: productForm.freight_priority,
            category_id: productForm.category_id,
            collection_id: productForm.collection_id,
            supplier_id: productForm.supplier_id,
            stock_type: productForm.stock_type,
            stock: productForm.stock,
          },
          productOptions: productsOptions.map((prodOpt) => {
            return {
              id: prodOpt.id,
              headline: prodOpt.headline,
              content: prodOpt.content,
              stock: prodOpt.stock,
              active: prodOpt.active,
            };
          }),
        })
        .then((response) => {
          Swal.fire({
            title: "Sucesso!",
            text: response.data.message,
            icon: "success",
            confirmButtonColor: blue["500"],
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/dashboard/produtos");
            }
          });
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          getErrorMessage({ error });
        });
    }
  }

  function getProductById(id: string) {
    api
      .get(`/products/get-by-id/${id}`)
      .then((response) => {
        setSelectedCategory(response.data.category);
        setSelectedCollection(response.data.collection);
        setProductsOptions(response.data.ProductOptions);
        setProductForm({
          active: response.data.active || "",
          category_id: response.data.category.id,
          collection_id: response.data.collection.id,
          supplier_id: response.data.supplier_id,
          freight_priority: response.data.freight_priority,
          code: response.data.code || "",
          name: response.data.name || "",
          price:
            parseFloat(response.data.price).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
            }) || "0.00",
          shipping_info: response.data.shipping_info,
          short_description: response.data.short_description || "",
          slug: response.data.slug || "",
          stock_type: response.data.stock_type,
          stock: response.data.stock || 0,
        });
        editor?.commands.setContent(response.data.description);
      })
      .catch((error) => getErrorMessage({ error }));
  }

  function handleActiveProductOptions(id: string, active: boolean) {
    const updated = productsOptions.map((prodOpt) => {
      if (prodOpt.id === id) {
        return { ...prodOpt, active };
      }

      return prodOpt;
    });

    setProductsOptions(updated);
  }

  function handleupdateProductOptStock(id: string, stock: number) {
    setProductOptId(id);
    setProductOptStock(stock);

    setDrawerOpen(true);
  }

  function updateProductOptionsStock() {
    const updated = productsOptions.map((prodOpt) => {
      if (prodOpt.id === productOptId) {
        return { ...prodOpt, stock: productOptStock };
      }

      return prodOpt;
    });

    setProductsOptions(updated);

    setDrawerOpen(false);
    setProductOptId("");
    setProductOptStock(0);
  }

  useEffect(() => {
    if (product) {
      setFormType({ type: "edit" });
      if (editor) {
        getProductById(product);
      }
    }
  }, [product, editor]);

  useEffect(() => {
    getFormData();
  }, []);

  return (
    <Box>
      <AppBar
        title={`${formType.type === "add" ? "Novo" : "Editar"} produto`}
      />

      <Container>
        <Box p={"20px"} display="flex" mb={-2}>
          <Button
            onClick={() => navigate("/dashboard/produtos")}
            startIcon={<FiChevronLeft />}
          >
            Voltar
          </Button>
        </Box>

        <DefaultContainer>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Autocomplete
                id="categories"
                getOptionLabel={(option: any) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={categories}
                disabled={formType.type === "edit"}
                renderInput={(params) => (
                  <InputText {...params} label="Categoria" fullWidth />
                )}
                value={selectedCategory}
                onChange={(_, newValue) =>
                  handleChangeCategory(newValue as CategoriesEntity)
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                id="collections"
                getOptionLabel={(option: any) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={filteredCollections}
                disabled={formType.type === "edit"}
                renderInput={(params) => (
                  <InputText {...params} label="Sub-categoria" fullWidth />
                )}
                value={selectedCollection}
                onChange={(_, newValue) =>
                  handleChangeCollection(newValue as CollectionsEntity)
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                id="supplier"
                getOptionLabel={(option: SupplierEntity) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={suppliers}
                disabled={formType.type === "edit"}
                renderInput={(params) => (
                  <InputText {...params} label="Marca" fullWidth />
                )}
                value={selectedSupplier}
                onChange={(_, newValue) =>
                  handleChangeSupplier(newValue as SupplierEntity)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputText
                label="Nome"
                fullWidth
                autoFocus
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({ ...productForm, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InputText
                label="Código"
                fullWidth
                value={productForm.code}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    code: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InputText
                label="Preço (R$)"
                fullWidth
                value={currencyMask(productForm.price as string)}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    price: currencyMask(e.target.value),
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <InputText
                label="Descrição curta"
                multiline
                fullWidth
                rows={3}
                value={productForm.short_description}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    short_description: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <RichEditor editor={editor} />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small" variant="filled">
                <InputLabel id="demo-simple-select-label">
                  Tipo do estoque
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={productForm.stock_type}
                  label="Tipo do estoque"
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      stock_type: e.target.value,
                    })
                  }
                >
                  <MenuItem value={"OFF"}>Sem Estoque</MenuItem>
                  <MenuItem value={"UNITY"}>Unitário</MenuItem>
                  <MenuItem value={"CUSTOM"}>Personalizado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={9}>
              {productForm.stock_type === "CUSTOM" ? (
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={3}>
                    <InputText
                      label="Descrição"
                      fullWidth
                      value={productOptionForm.headline}
                      onChange={(e) =>
                        setProductOptionForm({
                          ...productOptionForm,
                          headline: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <InputText
                      label="Ordem"
                      fullWidth
                      value={productOptionForm.content}
                      onChange={(e) =>
                        setProductOptionForm({
                          ...productOptionForm,
                          content: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <InputText
                      label="Quantidade"
                      fullWidth
                      type="number"
                      value={productOptionForm.stock}
                      onChange={(e) =>
                        setProductOptionForm({
                          ...productOptionForm,
                          stock: Number(e.target.value),
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      size="large"
                      fullWidth
                      variant="outlined"
                      startIcon={<AiOutlinePlus />}
                      onClick={() => addProductOptions("add")}
                    >
                      ADD
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <InputText
                  label="Quantidade em estoque"
                  disabled={productForm.stock_type === "OFF"}
                  fullWidth
                  type="number"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      stock: Number(e.target.value),
                    })
                  }
                />
              )}
            </Grid>

            {productForm.stock_type === "CUSTOM" &&
            productsOptions.length !== 0 ? (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <List dense>
                    {productsOptions.map((prodOpt) => (
                      <ListItem
                        secondaryAction={
                          <>
                            {formType.type === "add" ? (
                              <IconButton
                                onClick={() =>
                                  removeProductOptions(prodOpt.id, "add")
                                }
                                size="small"
                                color="error"
                              >
                                <FaTrash />
                              </IconButton>
                            ) : (
                              <Stack direction={"row"} spacing={1}>
                                <IconButton
                                  onClick={() =>
                                    handleupdateProductOptStock(
                                      prodOpt.id,
                                      prodOpt.stock as number
                                    )
                                  }
                                  size="small"
                                  color="primary"
                                >
                                  <AiOutlineEdit />
                                </IconButton>
                                <Switch
                                  checked={prodOpt.active}
                                  onChange={(e) =>
                                    handleActiveProductOptions(
                                      prodOpt.id,
                                      e.target.checked
                                    )
                                  }
                                />
                              </Stack>
                            )}
                          </>
                        }
                        key={prodOpt.id}
                      >
                        <ListItemAvatar>
                          <Avatar>{prodOpt.headline}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`Quantidade: ${prodOpt.stock}`}
                          secondary={`Ordem: ${prodOpt.content}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>
            ) : null}

            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small" variant="filled">
                <InputLabel id="demo-simple-select-label">
                  Tipo de frete
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={productForm.freight_priority}
                  label="Tipo do estoque"
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      freight_priority: e.target.value,
                    })
                  }
                >
                  <MenuItem value={"FAST"}>Rápido</MenuItem>
                  <MenuItem value={"NORMAL"}>Normal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <InputText
                    label="Largura (cm)"
                    fullWidth
                    type="number"
                    value={productForm.shipping_info.width}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        shipping_info: {
                          ...productForm.shipping_info,
                          width: Number(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InputText
                    label="Altura (cm)"
                    fullWidth
                    type="number"
                    value={productForm.shipping_info.height}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        shipping_info: {
                          ...productForm.shipping_info,
                          height: Number(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InputText
                    label="Comprimento (cm)"
                    fullWidth
                    type="number"
                    value={productForm.shipping_info.lenght}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        shipping_info: {
                          ...productForm.shipping_info,
                          lenght: Number(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InputText
                    label="Peso (kg)"
                    fullWidth
                    type="number"
                    value={productForm.shipping_info.weight}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        shipping_info: {
                          ...productForm.shipping_info,
                          weight: Number(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            {formType.type === "add" && (
              <Grid item xs={12}>
                <Upload
                  name="thumbnail"
                  to="product"
                  id={productId}
                  disabled={productId.length === 0}
                  onFinish={() => navigate("/dashboard/produtos")}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Grid container spacing={2} justifyContent="flex-end">
                <Grid item xs={12} sm={6} md={3} lg={2}>
                  <Button
                    startIcon={<AiOutlineSave />}
                    variant="contained"
                    size="large"
                    fullWidth
                    loading={isLoading}
                    type="submit"
                    onClick={() => saveProduct()}
                    disabled={productId.length !== 0}
                  >
                    Salvar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
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
            <Typography variant="h6">Alterar Estoque</Typography>
            <IconButton size="small" onClick={() => setDrawerOpen(false)}>
              <AiOutlineClose />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Insira um novo valor para o estoque.
          </DialogContentText>

          <InputText
            label="Estoque"
            type="number"
            fullWidth
            value={productOptStock}
            onChange={(e) => setProductOptStock(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AiOutlineSave />}
            onClick={updateProductOptionsStock}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
