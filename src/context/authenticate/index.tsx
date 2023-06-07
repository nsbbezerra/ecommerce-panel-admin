import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

type AuthenticateProps = {
  token: string;
};

type PropsAuthenticateContext = {
  authenticate: AuthenticateProps;
  setAuthenticate: Dispatch<SetStateAction<AuthenticateProps>>;
};

const DEFAULT_VALUE = {
  authenticate: {
    token: "",
  },
  setAuthenticate: () => {},
};

const AuthenticateContext =
  createContext<PropsAuthenticateContext>(DEFAULT_VALUE);

type ProviderProps = {
  children: ReactNode | ReactNode[];
};

const AuthenticateProvider = ({ children }: ProviderProps) => {
  const [authenticate, setAuthenticate] = useState(DEFAULT_VALUE.authenticate);

  return (
    <AuthenticateContext.Provider value={{ authenticate, setAuthenticate }}>
      {children}
    </AuthenticateContext.Provider>
  );
};

export { AuthenticateProvider };

export default AuthenticateContext;
