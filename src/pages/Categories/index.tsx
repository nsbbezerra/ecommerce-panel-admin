import { Fragment, SetStateAction, useEffect, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Button from "../../components/layout/Button";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import {
  DataTable,
  DataTableSelectionChangeEvent,
  DataTableSelection,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { CategoriesEntity } from "../../services/entities/categories";
import { useQuery } from "react-query";
import { api } from "../../configs/api";
import { configs } from "../../configs";
import getErrorMessage from "../../helpers/getMessageError";
import Loading from "../../components/layout/Loading";
import Switch from "../../components/layout/Switch";
import { useNavigate } from "react-router-dom";
import Dialog from "../../components/layout/Dialog";
import InputText from "../../components/layout/InputText";
import getSuccessMessage from "../../helpers/getMessageSuccess";
import { Sidebar } from "primereact/sidebar";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoriesEntity[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");

  const [editDialog, setEditDialog] = useState<boolean>(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesEntity | null>(null);

  useEffect(() => {
    !editDialog && setSelectedCategory(null);
  }, [editDialog]);

  const { isLoading, refetch } = useQuery(
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

  const onRowSelect = () => {
    setEditDialog(true);
  };

  function updateInfo() {
    setIsUpdateLoading(true);
    api
      .put("/categories/update", {
        category: {
          id: categoryId,
          name,
          slug: name
            .normalize("NFD")
            .replaceAll(/[^\w\s]/gi, "")
            .replaceAll(" ", "-")
            .toLowerCase(),
        },
      })
      .then((response) => {
        getSuccessMessage({ message: response.data.message });
        setCategoryId("");
        setIsUpdateLoading(false);
      })
      .catch((error) => {
        getErrorMessage({ error });
        setIsUpdateLoading(false);
      });
  }

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
              selectionMode="radiobutton"
              dataKey="id"
              onSelectionChange={(
                e: DataTableSelectionChangeEvent<CategoriesEntity[]>
              ) =>
                setSelectedCategory(
                  e.value as SetStateAction<CategoriesEntity | null>
                )
              }
              onRowSelect={onRowSelect}
              metaKeySelection={false}
              selection={
                selectedCategory as DataTableSelection<CategoriesEntity[]>
              }
            >
              <Column
                selectionMode="single"
                headerStyle={{ width: "3rem" }}
                header="Ações"
              ></Column>
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
            </DataTable>
          )}
        </DefaultContainer>
      </Container>

      <Sidebar
        visible={editDialog}
        onHide={() => setEditDialog(false)}
        className="w-10 md:w-6 lg:w-6"
        position="right"
      >
        <h2>Sidebar</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </Sidebar>
    </Fragment>
  );
}
