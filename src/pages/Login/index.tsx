import { Fragment, useContext, useState } from "react";
import { AppDescription, LoginContainer, LoginFormContainer } from "./styles";
import InputText from "../../components/layout/InputText";

import bg from "../../assets/background.mp4";
import nk from "../../assets/nk.svg";
import Password from "../../components/layout/Password";
import Button from "../../components/layout/Button";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineLinkedin,
  AiOutlineLogin,
} from "react-icons/ai";
import { Stack } from "@mui/material";
import IconButton from "../../components/layout/IconButton";
import { TbBrandTelegram } from "react-icons/tb";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import Swal from "sweetalert2";
import { blue } from "@mui/material/colors";
import { sha256 } from "js-sha256";
import AuthenticateContext from "../../context/authenticate/index";

interface LoginFormProps {
  user: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState<LoginFormProps>({
    password: "",
    user: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setAuthenticate } = useContext(AuthenticateContext);

  function login() {
    if (!loginForm.user.length) {
      Swal.fire({
        title: "Atenção",
        text: "O usuário é obrigatório",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (!loginForm.password.length) {
      Swal.fire({
        title: "Atenção",
        text: "A senha é obrigatória",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    setIsLoading(true);
    api
      .post("/master-users/login", {
        user: loginForm.user,
        password: sha256(loginForm.password),
      })
      .then((response) => {
        setIsLoading(false);
        const token = response.data.token;

        localStorage.setItem("token", token);

        setAuthenticate({ token });

        navigate("/dashboard");
      })
      .catch((error) => {
        getErrorMessage({ error });
        setIsLoading(false);
      });
  }

  return (
    <Fragment>
      <LoginContainer>
        <video autoPlay loop muted className="video">
          <source src={bg} type="video/mp4" />
        </video>
        <LoginFormContainer>
          <img src={nk} alt="Image" width="100" />

          <Stack
            direction={"row"}
            spacing={2}
            justifyContent={"center"}
            mb={-2}
          >
            <IconButton color="primary">
              <TbBrandTelegram />
            </IconButton>
            <IconButton color="primary">
              <AiOutlineFacebook />
            </IconButton>
            <IconButton color="primary">
              <AiOutlineInstagram />
            </IconButton>
            <IconButton color="primary">
              <AiOutlineLinkedin />
            </IconButton>
          </Stack>

          <div className="inputs-container">
            <InputText
              label="Usuário"
              fullWidth
              name="user"
              autoFocus
              value={loginForm.user}
              onChange={(e) =>
                setLoginForm({
                  ...loginForm,
                  user: e.target.value.toLowerCase(),
                })
              }
            />
            <Password
              label="Senha"
              fullWidth
              name="password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
            />

            <Button
              variant="contained"
              startIcon={<AiOutlineLogin />}
              size="large"
              onClick={login}
              loading={isLoading}
            >
              LOGIN
            </Button>

            <AppDescription className="text-sm">
              © NK Systems - {new Date().getFullYear().toString()}
            </AppDescription>
          </div>
        </LoginFormContainer>
      </LoginContainer>
    </Fragment>
  );
}
