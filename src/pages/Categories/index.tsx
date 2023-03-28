import { Fragment, MouseEvent, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Button from "../../components/layout/Button";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import { CategoriesEntity } from "../../services/entities/categories";
import { useQuery } from "react-query";
import { api } from "../../configs/api";
import { configs } from "../../configs";
import getErrorMessage from "../../helpers/getMessageError";
import Loading from "../../components/layout/Loading";
import { useNavigate } from "react-router-dom";
import { AiOutlineEdit, AiOutlinePicture, AiOutlinePlus } from "react-icons/ai";
import {
  Box,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import { SeachContainer } from "../Clientes/styles";
import InputText from "../../components/layout/InputText";
import Switch from "../../components/layout/Switch";
import Avatar from "../../components/layout/Avatar";
import IconButton from "../../components/layout/IconButton";
import { FiChevronDown } from "react-icons/fi";

export default function CategoriesPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoriesEntity[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");

  const { isLoading, refetch } = useQuery(
    "categories",
    async () => {
      return await api.get("/categories/get-all");
    },
    {
      refetchInterval: configs.refetch,
      onError: (error) => getErrorMessage({ error }),
      onSuccess(response) {
        setCategories(response.data);
      },
    }
  );

  return (
    <Fragment>
      <AppBar title="Categorias" />
      <Container>
        <Box
          padding={"20px"}
          mb={-2}
          display="flex"
          justifyContent={"space-between"}
          alignItems="center"
          gap={2}
        >
          <Button
            onClick={() => navigate("/dashboard/categorias/criar")}
            variant="contained"
            startIcon={<AiOutlinePlus />}
            style={{ minWidth: "179px" }}
          >
            ADICIONAR NOVA
          </Button>

          <SeachContainer>
            <InputText label="Digite para buscar" fullWidth />
          </SeachContainer>
        </Box>
      </Container>

      <Container>
        <DefaultContainer>
          {isLoading ? (
            <Loading />
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width={"5%"} align="center">
                      Ativo?
                    </TableCell>
                    <TableCell width={"5%"} align="center">
                      Thumb
                    </TableCell>
                    <TableCell style={{ minWidth: "280px" }}>Nome</TableCell>
                    <TableCell style={{ minWidth: "280px" }}>Slug</TableCell>
                    <TableCell width={"5%"} align="center">
                      Ações
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id} hover>
                      <TableCell align="center">
                        <Switch checked />
                      </TableCell>
                      <TableCell align="center">
                        <Avatar src={category.thumbnail as string} />
                      </TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          id="basic-button"
                          aria-controls={open ? "basic-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          onClick={handleClick}
                          size="small"
                          color="primary"
                        >
                          <FiChevronDown />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                      dense: true,
                    }}
                    anchorOrigin={{ horizontal: "right", vertical: "top" }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    elevation={3}
                  >
                    <MenuItem onClick={handleClose}>
                      <ListItemIcon>
                        <AiOutlineEdit />
                      </ListItemIcon>
                      <ListItemText>Editar</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <ListItemIcon>
                        <AiOutlinePicture />
                      </ListItemIcon>
                      <ListItemText>Alterar Imagem</ListItemText>
                    </MenuItem>
                  </Menu>
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
