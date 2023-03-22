import { Fragment, useRef, useState } from "react";
import AppBar from "../../components/layout/AppBar";
import Container from "../../components/layout/Container";
import DefaultContainer from "../../components/layout/DefaultContainer";
import { GetAllClientsEntity } from "../../services/entities/clients";
import { useQuery } from "react-query";
import { configs } from "../../configs";
import { api } from "../../configs/api";
import getErrorMessage from "../../helpers/getMessageError";
import Loading from "../../components/layout/Loading";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Button from "../../components/layout/Button";
import { Menu } from "primereact/menu";
import Dialog from "../../components/layout/Dialog";
import { Fieldset } from "primereact/fieldset";

export default function ClientsPage() {
  const [clients, setClients] = useState<GetAllClientsEntity[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const menu = useRef<Menu>(null);

  const { isLoading } = useQuery(
    "clients",
    async () => {
      return await api.get("/clients/get-all");
    },
    {
      refetchInterval: configs.refetch,
      onError: (error) => getErrorMessage({ error }),
      onSuccess(response) {
        setClients(response.data);
      },
    }
  );

  const statusBodyTemplate = (client: GetAllClientsEntity) => {
    return (
      <>
        <Menu
          model={[
            {
              label: "Endereço",
              items: [
                {
                  label: "Visualizar",
                  icon: "pi pi-search-plus",
                  command: () => {
                    setIsDialogOpen(true);
                  },
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

  return (
    <Fragment>
      <AppBar title="Clientes" icon="pi-users" />
      <Container>
        <DefaultContainer>
          {isLoading ? (
            <Loading />
          ) : (
            <DataTable
              value={clients}
              paginator
              rows={20}
              tableStyle={{ minWidth: "50rem" }}
              scrollable
              stripedRows
            >
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
              <Column
                field="document"
                header="Documento"
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
              <Column field="phone" header="Telefone"></Column>
              <Column field="email" header="Email"></Column>
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

      <Dialog
        header="Endereço"
        visible={isDialogOpen}
        onHide={() => setIsDialogOpen(false)}
        style={{ width: "65vw" }}
        breakpoints={{ "960px": "75vw", "641px": "95vw" }}
      >
        <div className="grid">
          <div className="col-12 sm:col-8">
            <Fieldset legend="Rua">
              <p className="m-0">Rua 34</p>
            </Fieldset>
          </div>
          <div className="col-12 sm:col-4">
            <Fieldset legend="Número">
              <p className="m-0">343</p>
            </Fieldset>
          </div>
          <div className="col-12 sm:col-6">
            <Fieldset legend="Complemento">
              <p className="m-0">Rua 34</p>
            </Fieldset>
          </div>
          <div className="col-12 sm:col-6">
            <Fieldset legend="Bairro">
              <p className="m-0">343</p>
            </Fieldset>
          </div>
          <div className="col-12 sm:col-4">
            <Fieldset legend="CEP">
              <p className="m-0">77.710-000</p>
            </Fieldset>
          </div>
          <div className="col-12 sm:col-6">
            <Fieldset legend="Cidade">
              <p className="m-0">Pedro Afonso</p>
            </Fieldset>
          </div>
          <div className="col-12 sm:col-2">
            <Fieldset legend="Estado">
              <p className="m-0">TO</p>
            </Fieldset>
          </div>
        </div>
      </Dialog>
    </Fragment>
  );
}
