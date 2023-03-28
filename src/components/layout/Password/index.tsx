import {
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  FilledInput,
  FilledInputProps,
} from "@mui/material";
import { Password as PrimePassword, PasswordProps } from "primereact/password";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface Props {
  label: string;
  fullWidth?: boolean;
}

type DefaultProps = FilledInputProps & Props;

export default function Password({
  label,
  fullWidth = false,
  name,
  ...rest
}: DefaultProps) {
  const [showPass, setShowPass] = useState<boolean>(false);
  return (
    <FormControl variant="filled" fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <FilledInput
        {...rest}
        type={showPass ? "text" : "password"}
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={() => setShowPass(!showPass)} size="small">
              {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}
