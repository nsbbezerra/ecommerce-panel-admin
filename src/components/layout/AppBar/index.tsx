import { useContext } from "react";
import BooleanEventsContext from "../../../context/booleanEvents";
import Avatar from "../Avatar";
import Button from "../Button";
import { Header } from "./styles";

interface Props {
  title: string;
  icon: string;
}

export default function AppBar({ icon, title }: Props) {
  const { is, setIs } = useContext(BooleanEventsContext);

  return (
    <Header>
      <div className="header-text text-lg gap-3">
        <div className="menu-button">
          <Button
            icon="pi pi-bars"
            text
            onClick={() => setIs({ isSiderOpen: !is.isSiderOpen })}
          />
        </div>
        <i className={`pi ${icon}`}></i>
        <span>{title}</span>
      </div>

      <div className="header-buttons">
        <div className="hidden md:flex gap-3 align-items-center w-15rem">
          <Avatar icon="pi pi-user" size="normal" shape="circle" />
          <span>Natanael Bezerra</span>
        </div>
        <Button
          icon="pi pi-sign-out"
          aria-label="Filter"
          severity="info"
          rounded
          tooltip="Sair do app"
          tooltipOptions={{ position: "bottom" }}
        />
      </div>
    </Header>
  );
}
