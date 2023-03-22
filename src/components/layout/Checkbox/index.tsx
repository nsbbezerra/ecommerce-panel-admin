import { Checkbox as PrimeCheckbox, CheckboxProps } from "primereact/checkbox";

interface Props {
  label: string;
}

type DefaultProps = CheckboxProps & Props;

export default function Checkbox({ label, name, ...rest }: DefaultProps) {
  return (
    <div className="flex align-items-center">
      <PrimeCheckbox inputId={name} {...rest} />
      <label htmlFor={name} className="ml-2">
        {label}
      </label>
    </div>
  );
}
