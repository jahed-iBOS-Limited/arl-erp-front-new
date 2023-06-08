import React from "react";
import { SalesTerritoryTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";
import ViewForm from "./View/viewModal";
import { Route } from "react-router-dom";

export default function SalesTerritory({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/sales-management/configuration/salesterritory/edit/${id}`);
    },
    openViewDialog: (id) => {
      history.push(`/sales-management/configuration/salesterritory/view/${id}`);
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <Route path="/sales-management/configuration/salesterritory/view/:id">
        {({ history, match }) => (
          <ViewForm
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/sales-management/configuration/salesterritory");
            }}
          />
        )}
      </Route>
      <SalesTerritoryTable />
    </UiProvider>
  );
}
