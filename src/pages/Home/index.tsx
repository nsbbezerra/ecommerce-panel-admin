import AppBar from "../../components/layout/AppBar";

import nk from "../../assets/nk.svg";
import { Fragment } from "react";
import { HomeConteiner } from "./style";
import { Stack, Typography } from "@mui/material";
import IconButton from "../../components/layout/IconButton";
import {
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineLinkedin,
} from "react-icons/ai";
import { TbBrandTelegram } from "react-icons/tb";

export default function HomePage() {
  return (
    <Fragment>
      <AppBar title="Início" />

      <HomeConteiner>
        <img src={nk} />

        <Typography>© NK Systems - 2023</Typography>

        <Stack direction={"row"} spacing={2}>
          <IconButton color="primary">
            <TbBrandTelegram />
          </IconButton>
          <IconButton color="primary">
            <AiOutlineFacebook />
          </IconButton>
          <IconButton color="primary">
            <AiOutlineInstagram />
          </IconButton>
          <IconButton color="primary">
            <AiOutlineLinkedin />
          </IconButton>
        </Stack>
      </HomeConteiner>
    </Fragment>
  );
}
