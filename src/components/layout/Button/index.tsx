import { LoadingButton, LoadingButtonProps } from "@mui/lab";

type DefaultProps = LoadingButtonProps;

export default function Button({ ...rest }: DefaultProps) {
  return <LoadingButton {...rest} />;
}
