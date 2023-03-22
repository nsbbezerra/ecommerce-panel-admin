import { Button as PrimeButton, ButtonProps } from "primereact/button";

interface Props {
  fullWidth?: boolean;
}

type DefaultProps = ButtonProps & Props;

export default function Button({ fullWidth = false, ...rest }: DefaultProps) {
  return <PrimeButton {...rest} className={fullWidth ? "w-full" : "w-fit"} />;
}
