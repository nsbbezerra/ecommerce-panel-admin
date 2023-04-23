import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { FaBoxOpen } from "react-icons/fa";

interface Props {
  label: string;
}

export default function EmptyBox({ label }: Props) {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      gap={1}
      p={2}
      width={"100%"}
      color={grey["800"]}
    >
      <FaBoxOpen fontSize={50} />
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
}
