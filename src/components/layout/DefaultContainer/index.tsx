import { ReactNode } from "react";
import {
  DefaultContainer as StyledDefaultContainer,
  ContentContainer,
} from "./styles";

interface Props {
  children?: ReactNode | ReactNode[];
  disabledPadding?: boolean;
}

export default function DefaultContainer({
  children,
  disabledPadding = false,
}: Props) {
  return (
    <StyledDefaultContainer disabledPadding>
      <ContentContainer>{children}</ContentContainer>
    </StyledDefaultContainer>
  );
}
