import { Fragment, useEffect, useState } from "react";
import DefaultContainer from "../../components/layout/DefaultContainer";
import {
  Grid,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import InputText from "../../components/layout/InputText";
import Password from "../../components/layout/Password";
import Button from "../../components/layout/Button";
import { AiOutlineClear, AiOutlineEdit, AiOutlineSave } from "react-icons/ai";
import IconButton from "../../components/layout/IconButton";
import { MasterUserDto } from "../../services/dto/master-users";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import getSuccessMessage from "../../helpers/getMessageSuccess";
import Swal from "sweetalert2";
import { blue } from "@mui/material/colors";
import { sha256 } from "js-sha256";
import { MasterUserEntity } from "../../services/entities/master-users";
import Loading from "../../components/layout/Loading";
import EmptyBox from "../../components/layout/EmptyBox";

export default function ConfigsUsers() {
  const [typeForm, setTypeForm] = useState<"add" | "edit">("add");
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [usersForm, setUsersForm] = useState<MasterUserDto>({
    active: true,
    password: "",
    user: "",
  });

  const [userId, setUserId] = useState<string>("");

  const [users, setUsers] = useState<MasterUserEntity[]>([]);

  function clear() {
    setTypeForm("add");
    setUsersForm({
      active: true,
      password: "",
      user: "",
    });
    setUserId("");
  }

  function getUsers() {
    setIsLoading(true);
    api
      .get("/master-users/get-all")
      .then((response) => {
        setIsLoading(false);
        setUsers(response.data);
      })
      .catch((error) => {
        setIsLoading(false);
        getErrorMessage({ error });
      });
  }

  function saveMasterUser() {
    if (!usersForm.user.length) {
      Swal.fire({
        title: "Atenção",
        text: "O usuário é obrigatório",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (!usersForm.password.length || !usersForm.password) {
      Swal.fire({
        title: "Atenção",
        text: "A senha é obrigatória",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (typeForm === "add") {
      setSubmitLoading(true);
      api
        .post("/master-users/save", {
          master: { ...usersForm, password: sha256(usersForm.password) },
        })
        .then((response) => {
          getSuccessMessage({ message: response.data.message });
          setSubmitLoading(false);
          getUsers();
        })
        .catch((error) => {
          setSubmitLoading(false);
          getErrorMessage({ error });
        });
    } else {
      setSubmitLoading(true);
      api
        .put("/master-users/update", {
          master: {
            ...usersForm,
            id: userId,
            password: sha256(usersForm.password),
          },
        })
        .then((response) => {
          getSuccessMessage({ message: response.data.message });
          setSubmitLoading(false);
          getUsers();
          clear();
        })
        .catch((error) => {
          setSubmitLoading(false);
          getErrorMessage({ error });
        });
    }
  }

  function handleEdit(user: MasterUserEntity) {
    setUserId(user.id);
    setUsersForm({ ...usersForm, user: user.user, active: user.active });
    setTypeForm("edit");
  }

  function handleActive(id: string, active: boolean) {
    api
      .put("/master-users/update", {
        master: {
          id,
          active,
        },
      })
      .then((response) => {
        getSuccessMessage({ message: response.data.message });
        getUsers();
      })
      .catch((error) => {
        getErrorMessage({ error });
      });
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Fragment>
      <Stack spacing={2}>
        <DefaultContainer disabledPadding>
          <Grid container spacing={2} alignItems={"center"}>
            <Grid item xs={12} md={4}>
              <InputText
                fullWidth
                label="Usuário"
                value={usersForm.user}
                onChange={(e) =>
                  setUsersForm({
                    ...usersForm,
                    user: e.target.value.toLowerCase(),
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Password
                fullWidth
                label="Senha"
                value={usersForm.password}
                onChange={(e) =>
                  setUsersForm({ ...usersForm, password: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                size="large"
                variant="contained"
                startIcon={<AiOutlineClear />}
                fullWidth
                color="error"
                onClick={clear}
              >
                Limpar
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                size="large"
                variant="contained"
                startIcon={<AiOutlineSave />}
                fullWidth
                loading={submitLoading}
                onClick={saveMasterUser}
              >
                Salvar
              </Button>
            </Grid>
          </Grid>
        </DefaultContainer>

        <DefaultContainer disabledPadding disablePaddingInside>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {!users.length ? (
                <EmptyBox label="Nenhuma informação encontrada" />
              ) : (
                <TableContainer sx={{ py: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: "10px", minWidth: "10px" }}>
                          Ativo?
                        </TableCell>
                        <TableCell>Usuário</TableCell>
                        <TableCell sx={{ textAlign: "right" }}>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow hover key={user.id}>
                          <TableCell>
                            <Switch
                              checked={user.active}
                              onChange={(e) =>
                                handleActive(user.id, e.target.checked)
                              }
                            />
                          </TableCell>
                          <TableCell>{user.user}</TableCell>
                          <TableCell>
                            <Stack
                              direction={"row"}
                              justifyContent={"end"}
                              alignItems={"center"}
                              spacing={1}
                            >
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEdit(user)}
                              >
                                <AiOutlineEdit />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </DefaultContainer>
      </Stack>
    </Fragment>
  );
}
