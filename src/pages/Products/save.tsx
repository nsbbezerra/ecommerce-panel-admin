import {
  Autocomplete,
  Box,
  Card,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import { Fragment } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AppBar from "../../components/layout/AppBar";
import Button from "../../components/layout/Button";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import InputText from "../../components/layout/InputText";
import RichEditor from "../../components/layout/RichEditor";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { AiOutlinePlus, AiOutlineSave } from "react-icons/ai";
import IconButton from "../../components/layout/IconButton";
import Avatar from "../../components/layout/Avatar";
import { FaTrash } from "react-icons/fa";
import Upload from "../../components/layout/Upload";

export default function SaveProduct() {
  const navigate = useNavigate();
  const editor = useEditor({
    extensions: [StarterKit],
    content: "Insira seu texto aqui",
  });

  return (
    <Fragment>
      <AppBar title="Novo produto" />

      <Container>
        <Box p={"20px"} display="flex" mb={-2}>
          <Button
            onClick={() => navigate("/dashboard/produtos")}
            startIcon={<FiChevronLeft />}
          >
            Voltar
          </Button>
        </Box>

        <DefaultContainer>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                id="category"
                options={[]}
                renderInput={(params) => (
                  <InputText
                    {...params}
                    label="Categoria"
                    size="small"
                    variant="filled"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                id="collection"
                options={[]}
                renderInput={(params) => (
                  <InputText
                    {...params}
                    label="Sub-categoria"
                    size="small"
                    variant="filled"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={7} md={9}>
              <InputText label="Nome" fullWidth />
            </Grid>
            <Grid item xs={12} sm={5} md={3}>
              <InputText label="Preço (R$)" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <InputText
                label="Descrição curta"
                multiline
                maxRows={3}
                fullWidth
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <RichEditor editor={editor} />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small" variant="filled">
                <InputLabel id="demo-simple-select-label">
                  Tipo do estoque
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={""}
                  label="Tipo do estoque"
                  onChange={() => {}}
                >
                  <MenuItem value={10}>Unitário</MenuItem>
                  <MenuItem value={20}>Personalizado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <InputText label="Descrição" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InputText label="Ordem" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InputText label="Quantidade" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    size="large"
                    fullWidth
                    variant="outlined"
                    startIcon={<AiOutlinePlus />}
                  >
                    ADD
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined">
                <List dense>
                  <ListItem
                    secondaryAction={
                      <IconButton>
                        <FaTrash />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>38</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Descrição: 38"
                      secondary="Ordem: 1"
                    />
                  </ListItem>

                  <ListItem
                    secondaryAction={
                      <IconButton>
                        <FaTrash />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>38</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Descrição: 38"
                      secondary="Ordem: 1"
                    />
                  </ListItem>

                  <ListItem
                    secondaryAction={
                      <IconButton>
                        <FaTrash />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>38</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Descrição: 38"
                      secondary="Ordem: 1"
                    />
                  </ListItem>
                </List>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small" variant="filled">
                <InputLabel id="demo-simple-select-label">
                  Tipo de frete
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={""}
                  label="Tipo do estoque"
                  onChange={() => {}}
                >
                  <MenuItem value={10}>Rápido</MenuItem>
                  <MenuItem value={20}>Normal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <InputText label="Largura (cm)" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InputText label="Altura (cm)" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InputText label="Comprimento (cm)" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <InputText label="Peso (kg)" fullWidth />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Upload name="thumbnail" to="product" id="" disabled />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2} justifyContent="flex-end">
                <Grid item xs={12} sm={6} md={3} lg={2}>
                  <Button
                    startIcon={<AiOutlineSave />}
                    variant="contained"
                    size="large"
                    fullWidth
                  >
                    Salvar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DefaultContainer>
      </Container>
    </Fragment>
  );
}
