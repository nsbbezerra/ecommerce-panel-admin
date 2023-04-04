import {
  Box,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Fragment, MouseEvent, useState } from "react";
import { AiOutlineEdit, AiOutlinePicture, AiOutlinePlus } from "react-icons/ai";
import { BsLock, BsPercent, BsTags, BsZoomIn } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
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

const ITEM_HEIGHT = 48;

export default function ProductsPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

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
                <TableRow>
                  <TableCell>
                    <Switch />
                  </TableCell>
                  <TableCell>
                    <Switch />
                  </TableCell>
                  <TableCell>
                    <Avatar />
                  </TableCell>
                  <TableCell>Produto</TableCell>
                  <TableCell>
                    <Button fullWidth startIcon={<BsZoomIn />} size="small">
                      Visualizar
                    </Button>
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    R$ 12.000,00
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
                        <IconButton color="primary" size="small">
                          <AiOutlinePicture />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DefaultContainer>
      </Container>
    </Fragment>
  );
}
