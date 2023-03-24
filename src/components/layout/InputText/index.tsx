import {
  InputText as PrimeInputText,
  InputTextProps,
} from "primereact/inputtext";

interface Props {
  label: string;
  fullWidth?: boolean;
}

type DefaultPros = InputTextProps & Props;

export default function InputText({
  label,
  name,
  fullWidth = false,
  ...rest
}: DefaultPros) {
  return (
    <span className="p-float-label w-full">
      <PrimeInputText
        {...rest}
        id={name}
        className={fullWidth ? "w-full" : ""}
      />
      <label htmlFor={name}>{label}</label>
    </span>
  );
}
