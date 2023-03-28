import MuiTooltip, { TooltipProps } from "@mui/material/Tooltip";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode | ReactNode[];
}

type DefaultProps = TooltipProps & Props;

export default function Tooltip({ children, ...rest }: DefaultProps) {
  return <MuiTooltip {...rest}>{children}</MuiTooltip>;
}
