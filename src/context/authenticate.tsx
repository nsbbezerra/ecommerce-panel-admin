import { ReactNode } from "react";
import { AuthenticateProvider } from "./authenticate/index";

interface Props {
  children: ReactNode | ReactNode[];
}

const GlobalAuthenticateContext = ({ children }: Props) => {
  return <AuthenticateProvider>{children}</AuthenticateProvider>;
};

export default GlobalAuthenticateContext;
