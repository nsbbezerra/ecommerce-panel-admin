import {
  AppContent,
  AvatarContainer,
  CompanyName,
  HomeContainer,
  Menu,
  MenuItem,
  SideBar,
} from "./styles";
import { Button } from "primereact/button";
import { useContext, useEffect, useState } from "react";
import Avatar from "../Avatar";
import Tooltip from "../Tooltip";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import BooleanEventsContext from "../../../context/booleanEvents";

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
        <Button
          icon={`pi ${is.isSiderOpen ? "pi-chevron-left" : "pi-chevron-right"}`}
          aria-label="Filter"
          severity="info"
          rounded
          raised
          size="small"
          style={{
            position: "absolute",
            top: "10px",
            right: "-17px",
          }}
          onClick={() => setIs({ isSiderOpen: !is.isSiderOpen })}
        />

        <AvatarContainer>
          <Avatar
            className="avatar shadow-7"
            image="https://img.freepik.com/vetores-gratis/conceito-do-logotipo-da-letra-k-para-sua-marca-real_1017-33266.jpg?w=2000"
            shape="circle"
            size={is.isSiderOpen ? "xlarge" : "normal"}
          />
        </AvatarContainer>
        <CompanyName isOpen={is.isSiderOpen}>NK Gráfica Online</CompanyName>
        <Tooltip target={is.isSiderOpen ? "" : ".menu-item"} position="right" />
        <Menu>
          <MenuItem
            isActive={itemActive === "/dashboard"}
            isOpen={is.isSiderOpen}
            className="menu-item"
            data-pr-tooltip="INÍCIO"
            onClick={() => navigate("/dashboard")}
          >
            <i className="pi pi-home menu-icon"></i>
            <span className="menu-text">INÍCIO</span>
          </MenuItem>
          <MenuItem
            isActive={itemActive === "/dashboard/clientes"}
            isOpen={is.isSiderOpen}
            className="menu-item"
            data-pr-tooltip="CLIENTES"
            onClick={() => navigate("/dashboard/clientes")}
          >
            <i className="pi pi-users menu-icon"></i>
            <span className="menu-text">CLIENTES</span>
          </MenuItem>
          <MenuItem
            isActive={
              itemActive === "/dashboard/categorias" ||
              itemActive === "/dashboard/categorias/criar"
            }
            isOpen={is.isSiderOpen}
            className="menu-item"
            data-pr-tooltip="CATEGORIAS"
            onClick={() => navigate("/dashboard/categorias")}
          >
            <i className="pi pi-tag menu-icon"></i>
            <span className="menu-text">CATEGORIAS</span>
          </MenuItem>
          <MenuItem
            isActive={false}
            isOpen={is.isSiderOpen}
            className="menu-item"
            data-pr-tooltip="PRODUTOS"
          >
            <i className="pi pi-tags menu-icon"></i>
            <span className="menu-text">PRODUTOS</span>
          </MenuItem>
          <MenuItem
            isActive={false}
            isOpen={is.isSiderOpen}
            className="menu-item"
            data-pr-tooltip="VENDAS"
          >
            <i className="pi pi-shopping-cart menu-icon"></i>
            <span className="menu-text">VENDAS</span>
          </MenuItem>
          <MenuItem
            isActive={false}
            isOpen={is.isSiderOpen}
            className="menu-item"
            data-pr-tooltip="FINANCEIRO"
          >
            <i className="pi pi-chart-line menu-icon"></i>
            <span className="menu-text">FINANCEIRO</span>
          </MenuItem>
          <MenuItem
            isActive={false}
            isOpen={is.isSiderOpen}
            className="menu-item"
            data-pr-tooltip="FISCAL"
          >
            <i className="pi pi-file-export menu-icon"></i>
            <span className="menu-text">FISCAL</span>
          </MenuItem>
          <MenuItem
            isActive={false}
            isOpen={is.isSiderOpen}
            className="menu-item"
            data-pr-tooltip="CONFIGURAÇÕES"
          >
            <i className="pi pi-cog menu-icon"></i>
            <span className="menu-text">CONFIGURAÇÕES</span>
          </MenuItem>
        </Menu>
      </SideBar>
      <AppContent>
        <Outlet />
      </AppContent>
    </HomeContainer>
  );
}
