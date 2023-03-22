import { Dialog as PrimeDialog, DialogProps } from "primereact/dialog";
import { ReactNode } from "react";

interface Props {
  children: ReactNode | ReactNode[];
}

type DefaultProps = DialogProps & Props;

export default function Dialog({ children, ...rest }: DefaultProps) {
  return <PrimeDialog {...rest}>{children}</PrimeDialog>;
}
