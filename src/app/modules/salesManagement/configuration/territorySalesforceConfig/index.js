import React from "react";
import { TerritorySalesForceConfigTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";
import ViewForm from "./View/viewModal";
import { Route } from "react-router-dom";

export function TerritorySalesForceConfig({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/sales-management/configuration/territorysalesforceconfig/edit/${id}`);
    },
    openViewDialog: (id) => {
      history.push(`/sales-management/configuration/territorysalesforceconfig/view/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <Route path="/sales-management/configuration/territorysalesforceconfig/view/:id">
    {({ history, match }) => (
      <ViewForm
        show={match != null}
        id={match && match.params.id}
        history={history}
        onHide={() => {
          history.push("/sales-management/configuration/territorysalesforceconfig")
        }} />
    )}
  </Route>
      <TerritorySalesForceConfigTable />
    </UiProvider>
  );
};
