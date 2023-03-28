import { FormControlLabel } from "@mui/material";
import MuiCheckbox from "@mui/material/Checkbox";
import { ChangeEvent } from "react";

interface Props {
  label: string;
  isChecked: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export default function Checkbox({ label, isChecked, onChange }: Props) {
  return (
    <FormControlLabel
      control={<MuiCheckbox defaultChecked={isChecked} onChange={onChange} />}
      label={label}
      style={{ userSelect: "none" }}
    />
  );
}
