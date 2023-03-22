import { Fragment } from "react";
import { AppDescription, LoginContainer, LoginFormContainer } from "./styles";
import InputText from "../../components/layout/InputText";
import Image from "../../components/layout/Image";

import wave from "../../assets/wave.svg";
import nk from "../../assets/nk.svg";
import Password from "../../components/layout/Password";
import Button from "../../components/layout/Button";
import { useNavigate } from "react-router-dom";
import Checkbox from "../../components/layout/Checkbox";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <Fragment>
      <LoginContainer image={wave}>
        <LoginFormContainer>
          <Image src={nk} alt="Image" width="100" />

          <div className="inputs-container">
            <InputText label="Empresa" fullWidth name="company_id" autoFocus />
            <InputText label="Usuário" fullWidth name="user" />
            <Password
              label="Senha"
              fullWidth
              name="password"
              toggleMask
              promptLabel="Insira uma senha"
              weakLabel="Senha fraca"
              mediumLabel="Senha razoável"
              strongLabel="Senha forte"
            />

            <Checkbox label="Mantenha-me conectado" checked={true} />

            <Button
              label="Login"
              size="large"
              icon="pi pi-sign-in"
              fullWidth
              onClick={() => navigate("/dashboard")}
            />

            <AppDescription className="text-sm">
              © NK Systems - 2023
            </AppDescription>
          </div>
        </LoginFormContainer>
      </LoginContainer>
    </Fragment>
  );
}
