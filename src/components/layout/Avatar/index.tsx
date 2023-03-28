import MuiAvatar, { AvatarProps } from "@mui/material/Avatar";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

type DefaultProps = AvatarProps & Props;

export default function Avatar({ children, ...rest }: DefaultProps) {
  return <MuiAvatar {...rest}>{children}</MuiAvatar>;
}
