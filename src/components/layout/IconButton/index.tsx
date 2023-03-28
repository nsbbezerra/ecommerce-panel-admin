import { IconButton as MuiIconButton, IconButtonProps } from "@mui/material";

export default function IconButton({ ...rest }: IconButtonProps) {
  return <MuiIconButton {...rest} />;
}
