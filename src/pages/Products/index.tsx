import {
  Box,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import { Fragment, MouseEvent, useEffect, useState } from "react";
import {
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlinePicture,
  AiOutlinePlus,
  AiOutlineTag,
} from "react-icons/ai";
import { BsLock, BsPercent, BsTags, BsTruck } from "react-icons/bs";
import {
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiPackage,
} from "react-icons/fi";
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
import { SeachContainer } from "../Clientes/styles";
import { ProductsWithRelationshipEntity } from "../../services/entities/products";
import { api } from "../../configs/api";
import { configs } from "../../configs";
import getErrorMessage from "../../helpers/getMessageError";
import Loading from "../../components/layout/Loading";
import formatCurrency from "../../helpers/formatCurrency";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { HiOutlineCollection } from "react-icons/hi";
import Upload from "../../components/layout/Upload";

interface CollapsedProps {
  id: string;
  open: boolean;
}

const ITEM_HEIGHT = 48;

export default function ProductsPage() {
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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

  const [search, setSearch] = useState<string>("");

  function getAllProducts(actualPage: number) {
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
  }

  function handleEditProduct(prod: ProductsWithRelationshipEntity) {
    setProductToUpdate(prod);
    setDrawerOpen(true);
  }

  function handleCloseModal() {
    setDrawerOpen(false);
    getAllProducts(page);
  }

  function handleMore() {
    const actualPage = page + 1;
    getAllProducts(actualPage);
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

          <SeachContainer style={{ display: "flex", gap: "10px" }}>
            <Tooltip title="Filtrar por" arrow>
              <Button
                aria-label="more"
                id="long-button"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                color="primary"
                sx={{ flexShrink: 0 }}
                style={{ flexShrink: "none" }}
                variant="outlined"
              >
                <FiFilter fontSize={20} />
              </Button>
            </Tooltip>
            <InputText label="Digite para buscar" fullWidth />
          </SeachContainer>
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
              dense: true,
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: "20ch",
              },
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <BsLock />
              </ListItemIcon>
              <ListItemText>Bloqueados</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <BsPercent />
              </ListItemIcon>
              <ListItemText>Promocionais</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <BsTags />
              </ListItemIcon>
              <ListItemText>Todos</ListItemText>
            </MenuItem>
          </Menu>
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
                          <Switch checked={product.active} />
                        </TableCell>
                        <TableCell>
                          <Switch checked={product.promotional} />
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
                        <TableCell sx={{ textAlign: "right" }}>
                          {formatCurrency(product.price)}
                        </TableCell>
                        <TableCell>
                          <Stack
                            spacing={1}
                            direction="row"
                            justifyContent={"center"}
                          >
                            <Tooltip title="Editar" arrow>
                              <IconButton color="primary" size="small">
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
                            <TabContext value={value}>
                              <Box
                                sx={{
                                  borderBottom: 1,
                                  borderTop: 1,
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
                                      {product.ProductOptions.map((prodOpt) => (
                                        <ListItem key={prodOpt.id}>
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
                                        product.freight_priority === "NORMAL"
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
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
                {products.length !== 0 && (
                  <>
                    {search.length ? (
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
        <DialogTitle>Alterar Imagem</DialogTitle>
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
        <DialogActions style={{ padding: "0px 24px 20px 0px" }}>
          <Button
            onClick={() => setDrawerOpen(false)}
            color="error"
            startIcon={<AiOutlineClose />}
            size="large"
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
