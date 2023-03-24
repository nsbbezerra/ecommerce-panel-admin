import { Password as PrimePassword, PasswordProps } from "primereact/password";

interface Props {
  label: string;
  fullWidth?: boolean;
}

type DefaultProps = PasswordProps & Props;

export default function Password({
  label,
  fullWidth = false,
  name,
  ...rest
}: DefaultProps) {
  return (
    <span className="p-float-label w-full block">
      <PrimePassword
        inputId={name}
        {...rest}
        className={fullWidth ? "w-full" : ""}
        inputClassName={fullWidth ? "w-full" : ""}
      />
      <label htmlFor={name}>{label}</label>
    </span>
  );
}
