import MuiSwitch, { SwitchProps } from "@mui/material/Switch";

export default function Switch({ ...rest }: SwitchProps) {
  return <MuiSwitch {...rest} />;
}
