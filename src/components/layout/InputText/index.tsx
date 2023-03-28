import TextField, { TextFieldProps } from "@mui/material/TextField";

type DefaultPros = TextFieldProps;

export default function InputText({ ...rest }: DefaultPros) {
  return <TextField {...rest} variant="filled" size="small" />;
}
