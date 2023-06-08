import React from "react";
import { CoreValuesTable } from "./Table/tableHeader";
import { UiProvider } from "../../_helper/uiContextHelper";
import { Route } from "react-router-dom";
import ViewForm from "./View/viewModal";

export function CoreValues({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/performance-management/configuration/core_values/edit/${id}`);
    },
    openViewDialog: (id) => {
      history.push(`/performance-management/configuration/core_values/view/${id}`);
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <CoreValuesTable />
      <Route path="/performance-management/configuration/core_values/view/:id">
        {({ history, match }) => (
          <ViewForm
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/performance-management/configuration/core_values");
            }}
          />
        )}
      </Route>
    </UiProvider>
  );
}
