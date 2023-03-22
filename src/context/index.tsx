import { ReactNode } from "react";
import { BooleanEventsProvider } from "./booleanEvents";

interface Props {
  children: ReactNode | ReactNode[];
}

const GlobalContext = ({ children }: Props) => {
  return <BooleanEventsProvider>{children}</BooleanEventsProvider>;
};

export default GlobalContext;
