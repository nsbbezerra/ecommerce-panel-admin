import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AuthenticateContext from "../context/authenticate/index";

export default function ProtectedRoute() {
  const navigate = useNavigate();
  const { authenticate, setAuthenticate } = useContext(AuthenticateContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!authenticate.token.length && token) {
      setAuthenticate({ token });
    }
    if (!authenticate.token.length && !token) return navigate("/");
  }, []);

  return <Outlet />;
}
