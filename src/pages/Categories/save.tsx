import { Fragment, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Button from "../../components/layout/Button";
import Container from "../../components/layout/Container";
import { useNavigate } from "react-router-dom";
import DefaultContainer from "../../components/layout/DefaultContainer";
import InputText from "../../components/layout/InputText";
import { FileUpload } from "primereact/fileupload";

export default function SaveCategoryPage() {
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState<string>("");
  return (
    <Fragment>
      <AppBar title="Nova categoria" icon="pi-tag" />
      <Container>
        <div style={{ padding: "20px" }} className="-mb-4">
          <Button
            label="Voltar"
            icon="pi pi-arrow-left"
            text
            onClick={() => navigate("/dashboard/categorias")}
          />
        </div>
      </Container>

      <Container>
        <DefaultContainer>
          <div className="grid -mb-2 align-items-center">
            <div className="col-12 sm:col-8 md:col-10">
              <InputText label="Nome" fullWidth autoFocus />
            </div>
            <div className="col-12 sm:col-4 md:col-2">
              <Button label="Salvar" icon="pi pi-save" fullWidth />
            </div>
            <div className="col-12">
              <FileUpload
                name="demo[]"
                url={"/api/upload"}
                accept="image/*"
                maxFileSize={1000000}
                emptyTemplate={
                  <p className="m-0">Arraste ou solte suas imagens aqui.</p>
                }
                chooseLabel="Selecionar"
                uploadLabel="Enviar"
                cancelLabel="Limpar"
                disabled={categoryId.length === 0}
              />
            </div>
          </div>
        </DefaultContainer>
      </Container>
    </Fragment>
  );
}
