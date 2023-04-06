import { Fragment } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import { Autocomplete, Divider, Grid, Stack, Typography } from "@mui/material";
import Avatar from "../../components/layout/Avatar";
import {
  AiOutlineCalendar,
  AiOutlineTags,
  AiOutlineUser,
} from "react-icons/ai";
import InputText from "../../components/layout/InputText";
import { format, parseISO } from "date-fns";

export default function PdvPage() {
  return (
    <Fragment>
      <AppBar title="Balcão de vendas" />
      <Container>
        <Grid container spacing={2} mt={"20px"}>
          <Grid item xs={12}>
            <DefaultContainer>
              <Grid container spacing={2} alignItems={"center"}>
                <Grid item xs={4}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={[]}
                    renderInput={(params) => (
                      <InputText {...params} label="Cliente" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <Avatar>
                      <AiOutlineUser />
                    </Avatar>
                    <Stack spacing={0}>
                      <Typography variant="body2">Natanael Bezerra</Typography>
                      <Typography variant="body2" color={"GrayText"}>
                        Admin
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>

                <Grid item xs={4}>
                  <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <Avatar>
                      <AiOutlineCalendar />
                    </Avatar>
                    <Stack spacing={0}>
                      <Typography variant="body2">
                        10 de abril de 2023
                      </Typography>
                      <Typography variant="body2" color={"GrayText"}>
                        Data da compra
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </DefaultContainer>
          </Grid>
          <Grid item xs={12}>
            <DefaultContainer disabledPadding={true}></DefaultContainer>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <DefaultContainer disabledPadding={true}></DefaultContainer>
              </Grid>
              <Grid item xs={4}>
                <DefaultContainer disabledPadding={true}>
                  <Stack direction={"row"} alignItems={"center"}>
                    <AiOutlineTags fontSize={20} />
                    <Typography variant="h6">asdasda</Typography>
                  </Stack>
                  <Divider sx={{ my: 1 }} />
                </DefaultContainer>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
}
