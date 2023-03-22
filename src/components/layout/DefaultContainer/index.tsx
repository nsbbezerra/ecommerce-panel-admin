import { ReactNode } from "react";
import {
  DefaultContainer as StyledDefaultContainer,
  ContentContainer,
} from "./styles";

interface Props {
  children?: ReactNode | ReactNode[];
}

export default function DefaultContainer({ children }: Props) {
  return (
    <StyledDefaultContainer>
      <ContentContainer>{children}</ContentContainer>
    </StyledDefaultContainer>
  );
}
