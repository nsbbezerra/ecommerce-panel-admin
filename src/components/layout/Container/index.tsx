import { ReactNode } from "react";
import { Container as AppContainer } from "./styles";

interface Props {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | never;
  children: ReactNode | ReactNode[];
}

export default function Container({ size = "2xl", children }: Props) {
  return <AppContainer size={size}>{children}</AppContainer>;
}
