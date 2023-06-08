import React from "react";
import { CompetencyTable } from "./Table/tableHeader";
import { UiProvider } from "../../_helper/uiContextHelper";
import { Route } from "react-router-dom";
import ViewForm from "./View/viewModal";

export function Competency({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/performance-management/configuration/core_competencies/edit/${id}`);
    },
    openViewDialog: (id) => {
      history.push(`/performance-management/configuration/core_competencies/view/${id}`);
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <Route path="/performance-management/configuration/core_competencies/view/:id">
        {({ history, match }) => (
          <ViewForm
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/performance-management/configuration/core_competencies");
            }}
          />
        )}
      </Route>
      <CompetencyTable />
    </UiProvider>
  );
}
