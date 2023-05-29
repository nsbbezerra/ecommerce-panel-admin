import { ReactNode } from "react";
import {
  DefaultContainer as StyledDefaultContainer,
  ContentContainer,
} from "./styles";

interface Props {
  children?: ReactNode | ReactNode[];
  disabledPadding?: boolean;
  disablePaddingInside?: boolean;
}

export default function DefaultContainer({
  children,
  disabledPadding = false,
  disablePaddingInside = false,
}: Props) {
  return (
    <StyledDefaultContainer disabledPadding={disabledPadding}>
      <ContentContainer disablePaddingInside={disablePaddingInside}>
        {children}
      </ContentContainer>
    </StyledDefaultContainer>
  );
}
