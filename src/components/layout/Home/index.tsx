import {
  AppContent,
  AvatarContainer,
  CompanyName,
  HomeContainer,
  Menu,
  MenuItem,
  SideBar,
} from "./styles";
import { useContext, useEffect, useState } from "react";
import Avatar from "../Avatar";
import Tooltip from "../Tooltip";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import BooleanEventsContext from "../../../context/booleanEvents";
import IconButton from "../IconButton";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { blue } from "@mui/material/colors";
import {
  AiOutlineHome,
  AiOutlineLineChart,
  AiOutlineShoppingCart,
  AiOutlineTag,
  AiOutlineTags,
  AiOutlineTool,
  AiOutlineUser,
} from "react-icons/ai";
import { TbFileInvoice, TbNotebook } from "react-icons/tb";
import { HiOutlineCollection } from "react-icons/hi";
import { Scrollbars } from "react-custom-scrollbars-2";

export default function Home() {
  const { is, setIs } = useContext(BooleanEventsContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [itemActive, setItemActive] = useState<string>("/home");

  useEffect(() => {
    setItemActive(location.pathname);
  }, [location.pathname]);

  return (
    <HomeContainer>
      <SideBar isOpen={is.isSiderOpen}>
        <IconButton
          style={{
            background: blue["500"],
            color: "#FFF",
            position: "absolute",
            top: "14px",
            right: "-13px",
          }}
          size="small"
          onClick={() => setIs({ isSiderOpen: !is.isSiderOpen })}
        >
          {is.isSiderOpen ? <FiChevronLeft /> : <FiChevronRight />}
        </IconButton>

        <AvatarContainer>
          <Avatar
            className="avatar"
            src="https://img.freepik.com/vetores-gratis/conceito-do-logotipo-da-letra-k-para-sua-marca-real_1017-33266.jpg?w=2000"
            sx={{
              width: is.isSiderOpen ? "100px" : "60%",
              height: is.isSiderOpen ? "100px" : "60%",
            }}
          />
        </AvatarContainer>
        <Menu>
          <Tooltip
            title="Início"
            placement="right"
            disableHoverListener={is.isSiderOpen}
            arrow
          >
            <MenuItem
              isActive={itemActive === "/dashboard"}
              isOpen={is.isSiderOpen}
              className="menu-item"
              data-pr-tooltip="INÍCIO"
              onClick={() => navigate("/dashboard")}
            >
              <AiOutlineHome className="menu-icon" fontSize={16} />
              <span className="menu-text">INÍCIO</span>
            </MenuItem>
          </Tooltip>
          <Tooltip
            title="Clientes"
            placement="right"
            disableHoverListener={is.isSiderOpen}
            arrow
          >
            <MenuItem
              isActive={itemActive === "/dashboard/clientes"}
              isOpen={is.isSiderOpen}
              className="menu-item"
              data-pr-tooltip="CLIENTES"
              onClick={() => navigate("/dashboard/clientes")}
            >
              <AiOutlineUser className="menu-icon" fontSize={16} />
              <span className="menu-text">CLIENTES</span>
            </MenuItem>
          </Tooltip>
          <Tooltip
            title="Categorias"
            placement="right"
            disableHoverListener={is.isSiderOpen}
            arrow
          >
            <MenuItem
              isActive={itemActive.includes("/dashboard/categorias")}
              isOpen={is.isSiderOpen}
              className="menu-item"
              data-pr-tooltip="CATEGORIAS"
              onClick={() => navigate("/dashboard/categorias")}
            >
              <AiOutlineTag className="menu-icon" fontSize={16} />
              <span className="menu-text">CATEGORIAS</span>
            </MenuItem>
          </Tooltip>
          <Tooltip
            title="Sub-categorias"
            placement="right"
            disableHoverListener={is.isSiderOpen}
            arrow
          >
            <MenuItem
              isActive={itemActive.includes("/dashboard/sub-categorias")}
              isOpen={is.isSiderOpen}
              className="menu-item"
              data-pr-tooltip="SUB-CATEGORIAS"
              onClick={() => navigate("/dashboard/sub-categorias")}
            >
              <HiOutlineCollection className="menu-icon" fontSize={16} />
              <span className="menu-text">SUB-CATEGORIAS</span>
            </MenuItem>
          </Tooltip>
          <Tooltip
            title="Produtos"
            placement="right"
            disableHoverListener={is.isSiderOpen}
            arrow
          >
            <MenuItem
              isActive={itemActive.includes("/dashboard/produtos")}
              isOpen={is.isSiderOpen}
              className="menu-item"
              data-pr-tooltip="PRODUTOS"
              onClick={() => navigate("/dashboard/produtos")}
            >
              <AiOutlineTags className="menu-icon" fontSize={16} />
              <span className="menu-text">PRODUTOS</span>
            </MenuItem>
          </Tooltip>
          <Tooltip
            title="Caixa"
            placement="right"
            disableHoverListener={is.isSiderOpen}
            arrow
          >
            <MenuItem
              isActive={itemActive.includes("/dashboard/caixa")}
              isOpen={is.isSiderOpen}
              className="menu-item"
              data-pr-tooltip="VENDAS"
              onClick={() => navigate("/dashboard/caixa")}
            >
              <TbNotebook className="menu-icon" fontSize={16} />
              <span className="menu-text">CAIXA</span>
            </MenuItem>
          </Tooltip>
          <Tooltip
            title="Vendas"
            placement="right"
            disableHoverListener={is.isSiderOpen}
            arrow
          >
            <MenuItem
              isActive={itemActive.includes("/dashboard/vendas")}
              isOpen={is.isSiderOpen}
              className="menu-item"
              data-pr-tooltip="VENDAS"
              onClick={() => navigate("/dashboard/vendas")}
            >
              <AiOutlineShoppingCart className="menu-icon" fontSize={16} />
              <span className="menu-text">VENDAS</span>
            </MenuItem>
          </Tooltip>
          <Tooltip
            title="Financeiro"
            placement="right"
            disableHoverListener={is.isSiderOpen}
            arrow
          >
            <MenuItem
              isActive={itemActive.includes("/dashboard/financeiro")}
              isOpen={is.isSiderOpen}
              className="menu-item"
              data-pr-tooltip="FINANCEIRO"
              onClick={() => navigate("/dashboard/financeiro/movimentos")}
            >
              <AiOutlineLineChart className="menu-icon" fontSize={16} />
              <span className="menu-text">FINANCEIRO</span>
            </MenuItem>
          </Tooltip>
          <Tooltip
            title="Fiscal"
            placement="right"
            disableHoverListener={is.isSiderOpen}
            arrow
          >
            <MenuItem
              isActive={false}
              isOpen={is.isSiderOpen}
              className="menu-item"
              data-pr-tooltip="FISCAL"
            >
              <TbFileInvoice className="menu-icon" fontSize={16} />
              <span className="menu-text">FISCAL</span>
            </MenuItem>
          </Tooltip>
          <Tooltip
            title="Configurações"
            placement="right"
            disableHoverListener={is.isSiderOpen}
            arrow
          >
            <MenuItem
              isActive={itemActive.includes("/dashboard/configuracoes")}
              isOpen={is.isSiderOpen}
              className="menu-item"
              data-pr-tooltip="CONFIGURAÇÕES"
              onClick={() => navigate("/dashboard/configuracoes")}
            >
              <AiOutlineTool className="menu-icon" fontSize={16} />
              <span className="menu-text">CONFIGURAÇÕES</span>
            </MenuItem>
          </Tooltip>
        </Menu>
      </SideBar>
      <Scrollbars>
        <AppContent>
          <Outlet />
        </AppContent>
      </Scrollbars>
    </HomeContainer>
  );
}
