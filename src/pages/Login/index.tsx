import { Fragment } from "react";
import { AppDescription, LoginContainer, LoginFormContainer } from "./styles";
import InputText from "../../components/layout/InputText";

import bg from "../../assets/bg.jpg";
import nk from "../../assets/nk.svg";
import Password from "../../components/layout/Password";
import Button from "../../components/layout/Button";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogin } from "react-icons/ai";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <Fragment>
      <LoginContainer image={bg}>
        <LoginFormContainer>
          <img src={nk} alt="Image" width="100" />

          <div className="inputs-container">
            <InputText label="Usuário" fullWidth name="user" autoFocus />
            <Password label="Senha" fullWidth name="password" />

            <Button
              variant="contained"
              startIcon={<AiOutlineLogin />}
              size="large"
              onClick={() => navigate("/dashboard")}
            >
              LOGIN
            </Button>

            <AppDescription className="text-sm">
              © NK Systems - 2023
            </AppDescription>
          </div>
        </LoginFormContainer>
      </LoginContainer>
    </Fragment>
  );
}
