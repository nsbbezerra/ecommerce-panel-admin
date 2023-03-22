import { Fragment, useRef, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Button from "../../components/layout/Button";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CategoriesEntity } from "../../services/entities/categories";
import { useQuery } from "react-query";
import { api } from "../../configs/api";
import { configs } from "../../configs";
import getErrorMessage from "../../helpers/getMessageError";
import { Menu } from "primereact/menu";
import Loading from "../../components/layout/Loading";
import Switch from "../../components/layout/Switch";
import { useNavigate } from "react-router-dom";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoriesEntity[]>([]);
  const menu = useRef<Menu>(null);

  const { isLoading } = useQuery(
    "categories",
    async () => {
      return await api.get("/categories/get-all");
    },
    {
      refetchInterval: configs.refetch,
      onError: (error) => getErrorMessage({ error }),
      onSuccess(response) {
        setCategories(response.data);
      },
    }
  );

  const statusBodyTemplate = (category: CategoriesEntity) => {
    return (
      <>
        <Menu
          model={[
            {
              label: "Edição",
              items: [
                {
                  label: "Editar",
                  icon: "pi pi-pencil",
                  command: () => {},
                },
              ],
            },
          ]}
          popup
          ref={menu}
        />
        <Button
          label="Opções"
          icon="pi pi-cog"
          onClick={(e) => {
            menu.current?.toggle(e);
          }}
          size="small"
          text
          fullWidth
        />
      </>
    );
  };

  const imageBodyTemplate = (category: CategoriesEntity) => {
    return (
      <img
        src={category.thumbnail || ""}
        alt={category.name}
        className="w-3rem shadow-2 border-round"
      />
    );
  };

  const switchBodyTemplate = (category: CategoriesEntity) => {
    return <Switch checked={category.active} />;
  };

  return (
    <Fragment>
      <AppBar title="Categorias" icon="pi-tag" />
      <Container>
        <div style={{ padding: "20px" }} className="-mb-3">
          <Button
            label="Adicionar nova"
            icon="pi pi-plus"
            raised
            onClick={() => navigate("/dashboard/categorias/criar")}
          />
        </div>
      </Container>

      <Container>
        <DefaultContainer>
          {isLoading ? (
            <Loading />
          ) : (
            <DataTable
              value={categories}
              paginator
              rows={20}
              tableStyle={{ minWidth: "50rem" }}
              scrollable
              stripedRows
              style={{ height: "1200px" }}
            >
              <Column
                header="Ativo?"
                style={{ width: "5%" }}
                body={switchBodyTemplate}
              ></Column>
              <Column
                header="Thumb."
                body={imageBodyTemplate}
                style={{ width: "5%" }}
              ></Column>
              <Column
                field="name"
                header="Nome"
                style={{ width: "35%" }}
                filter
                showAddButton={false}
                showFilterMatchModes={false}
                filterPlaceholder="Digite para buscar"
                showFilterMenuOptions={false}
                filterApply={(options) => (
                  <Button
                    label="Buscar"
                    size="small"
                    onClick={options.filterApplyCallback}
                  />
                )}
                filterClear={(options) => (
                  <Button
                    label="Limpar"
                    size="small"
                    outlined
                    onClick={options.filterClearCallback}
                  />
                )}
              ></Column>
              <Column field="slug" header="Slug"></Column>
              <Column
                field="id"
                header="Ações"
                body={statusBodyTemplate}
                style={{ width: "5%" }}
              ></Column>
            </DataTable>
          )}
        </DefaultContainer>
      </Container>
    </Fragment>
  );
}
