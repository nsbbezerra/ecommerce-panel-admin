import {
  Autocomplete,
  Box,
  Card,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
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
import { AiOutlinePlus, AiOutlineSave } from "react-icons/ai";
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

interface FormTypeProps {
  type: "add" | "edit";
}

export default function SaveProduct() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "Insira seu texto aqui",
  });
  const { product } = useParams();
  const navigate = useNavigate();

  const [formType, setFormType] = useState<FormTypeProps>({ type: "add" });
  const [categories, setCategories] = useState<CategoriesEntity[]>([]);
  const [collections, setCollections] = useState<CollectionsEntity[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<
    CollectionsEntity[]
  >([]);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesEntity | null>(null);
  const [selectedCollection, setSelectedCollection] =
    useState<CollectionsEntity | null>(null);

  const [productForm, setProductForm] = useState<ProductsDto>({
    active: true,
    freight_priority: "NORMAL",
    category_id: "",
    collection_id: "",
    name: "",
    price: "0.00",
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
    }
  );

  const [productId, setProductId] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [productsOptions, setProductsOptions] = useState<
    ProductOptionsEntity[]
  >([]);

  function getActiviesCategories() {
    api
      .get("/categories/all-actives")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => getErrorMessage({ error }));
  }

  function getActiviesCollections() {
    api
      .get("/collections/all-actives")
      .then((response) => {
        setCollections(response.data);
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
        },
      ]);

      setProductOptionForm({
        content: "",
        headline: "",
        stock: 0,
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
    if (!productForm.category_id.length) {
      Swal.fire({
        title: "Atenção",
        text: "Selecione uma categoria",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (!productForm.collection_id.length) {
      Swal.fire({
        title: "Atenção",
        text: "Selecione uma sub-categoria",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (!productForm.name.length) {
      Swal.fire({
        title: "Atenção",
        text: "Insira um nome para o produto",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (editor?.getHTML() === "<p>Insira seu texto aqui</p>") {
      Swal.fire({
        title: "Atenção",
        text: "Insira uma descrição detalhada para o produto",
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
            slug: productForm.name
              .normalize("NFD")
              .replaceAll(/[^\w\s]/gi, "")
              .replaceAll(" ", "-")
              .toLowerCase(),
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
            stock: productForm.stock,
          },
          productOptions: productsOptions.map((prodOpt) => {
            return {
              headline: prodOpt.headline,
              content: prodOpt.content,
              stock: prodOpt.stock,
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
            slug: productForm.name
              .normalize("NFD")
              .replaceAll(/[^\w\s]/gi, "")
              .replaceAll(" ", "-")
              .toLowerCase(),
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
            stock: productForm.stock,
          },
          productOptions: productsOptions.map((prodOpt) => {
            return {
              headline: prodOpt.headline,
              content: prodOpt.content,
              stock: prodOpt.stock,
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
          category_id: response.data.category.id || "",
          collection_id: response.data.collection.id || "",
          freight_priority: response.data.freight_priority,
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

  useEffect(() => {
    if (product) {
      setFormType({ type: "edit" });
      if (editor) {
        getProductById(product);
      }
    }
  }, [product, editor]);

  useEffect(() => {
    getActiviesCategories();
    getActiviesCollections();
  }, []);

  return (
    <Fragment>
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
            <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
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
            <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
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
            <Grid item xs={12} sm={7} md={9}>
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
            <Grid item xs={12} sm={5} md={3}>
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
                          <IconButton
                            onClick={() =>
                              removeProductOptions(prodOpt.id, "add")
                            }
                            size="small"
                            color="error"
                          >
                            <FaTrash />
                          </IconButton>
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
    </Fragment>
  );
}
