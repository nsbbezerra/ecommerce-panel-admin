import { blue } from "@mui/material/colors";
import { ReactElement, ReactNode, useContext } from "react";
import { AiOutlineLogout, AiOutlineMenu, AiOutlineUser } from "react-icons/ai";
import BooleanEventsContext from "../../../context/booleanEvents";
import Avatar from "../Avatar";
import Button from "../Button";
import IconButton from "../IconButton";
import Tooltip from "../Tooltip";
import { Header } from "./styles";

interface Props {
  title: string;
}

export default function AppBar({ title }: Props) {
  const { is, setIs } = useContext(BooleanEventsContext);

  return (
    <Header>
      <div className="header-text text-lg gap-3">
        <div className="menu-button">
          <IconButton onClick={() => setIs({ isSiderOpen: !is.isSiderOpen })}>
            <AiOutlineMenu />
          </IconButton>
        </div>

        <span>{title}</span>
      </div>

      <div className="header-buttons">
        <div className="account-info">
          <Avatar>
            <AiOutlineUser />
          </Avatar>
          <span>Natanael Bezerra</span>
        </div>
        <Tooltip title="Logout" arrow placement="bottom">
          <IconButton style={{ background: blue["400"], color: "#FFF" }}>
            <AiOutlineLogout />
          </IconButton>
        </Tooltip>
      </div>
    </Header>
  );
}
