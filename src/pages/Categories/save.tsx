import { FormEvent, Fragment, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Button from "../../components/layout/Button";
import Container from "../../components/layout/Container";
import { useNavigate } from "react-router-dom";
import DefaultContainer from "../../components/layout/DefaultContainer";
import InputText from "../../components/layout/InputText";
import { FileUpload } from "primereact/fileupload";
import { CategoriesDto } from "../../services/dto/categories";
import Swal from "sweetalert2";
import { api, apiUrl } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";

interface LoadingType {
  from: "thumbnail" | "form";
  loading: boolean;
}

export default function SaveCategoryPage() {
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState<string>("");
  const [categoryForm, setCategoryForm] = useState<CategoriesDto>({
    active: true,
    name: "",
    slug: "",
  });
  const [isLoading, setIsLoading] = useState<LoadingType>({
    from: "form",
    loading: false,
  });

  function clear() {
    setCategoryId("");
    setCategoryForm({
      active: true,
      name: "",
      slug: "",
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!categoryForm.name.length) {
      Swal.fire({
        title: "Atenção",
        text: "O nome é obrigatório",
        icon: "warning",
        confirmButtonColor: "var(--primary-color)",
      });
      return;
    }

    setIsLoading({ from: "form", loading: true });

    api
      .post("/categories/save", {
        category: {
          active: categoryForm.active,
          name: categoryForm.name,
          slug: categoryForm.name
            .normalize("NFD")
            .replaceAll(/[^\w\s]/gi, "")
            .replaceAll(" ", "-")
            .toLowerCase(),
        },
      })
      .then((response) => {
        setCategoryId(response.data.categoryId);
        Swal.fire({
          title: "Sucesso!",
          text: `${response.data.message}, agora deseja inserir uma foto para esta categoria?`,
          icon: "success",
          showDenyButton: true,
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: "Sim",
          denyButtonText: "Não",
          confirmButtonColor: "var(--primary-color)",
          denyButtonColor: "var(--red-500)",
        }).then((result) => {
          if (result.isDenied) {
            navigate("/dashboard/categorias");
          }
        });
        setIsLoading({ from: "form", loading: false });
      })
      .catch((error) => {
        getErrorMessage({ error });
        setIsLoading({ from: "form", loading: false });
      });
  }

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
          <form onSubmit={handleSubmit}>
            <div className="grid -mb-2 align-items-center">
              <div className="col-12 sm:col-8 md:col-10">
                <InputText
                  label="Nome"
                  fullWidth
                  autoFocus
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  value={categoryForm.name}
                />
              </div>
              <div className="col-12 sm:col-4 md:col-2">
                <Button
                  label="Salvar"
                  icon="pi pi-save"
                  fullWidth
                  type="submit"
                  loading={isLoading.from === "form" && isLoading.loading}
                />
              </div>
              <div className="col-12">
                <FileUpload
                  name="thumbnail"
                  url={`${apiUrl}/thumbnail/update/category/${categoryId}/none`}
                  accept="image/*"
                  maxFileSize={1000000}
                  emptyTemplate={
                    <p className="m-0">
                      {categoryId.length === 0
                        ? "Insira a categoria para adicionar sua imagem"
                        : "Arraste ou solte suas imagens aqui."}
                    </p>
                  }
                  chooseLabel="Selecionar"
                  uploadLabel="Enviar"
                  cancelLabel="Limpar"
                  disabled={categoryId.length === 0}
                  onUpload={() => {
                    Swal.fire({
                      title: "Sucesso!",
                      text: "Imagem inserida com sucesso, deseja retornar à tela inicial?",
                      icon: "question",
                      showConfirmButton: true,
                      showCancelButton: false,
                      showDenyButton: true,
                      confirmButtonColor: "var(--primary-color)",
                      denyButtonColor: "var(--red-500)",
                      denyButtonText: "Não",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        navigate("/dashboard/categorias");
                      }
                      if (result.isDenied) {
                        clear();
                      }
                    });
                  }}
                />
              </div>
            </div>
          </form>
        </DefaultContainer>
      </Container>
    </Fragment>
  );
}
