import React from "react";
import ValuesAndCompetencyPage from "./Form/addEditForm";
import { UiProvider } from "../../_helper/uiContextHelper";
import { Route } from "react-router-dom";
import ViewModal from "./Form/_viewModal.js";

export function ValuesCompetencySupervisor({ history }) {
  return (
    <UiProvider>
      <ValuesAndCompetencyPage />
      <Route path="/performance-management/sup_entry/view">
        {({ history, match }) => (
          <ViewModal
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={(value) => {
              history.push({
                pathname:
                  "/performance-management/sup_entry",
                _data: value,
              });
            }}
          />
        )}
      </Route>
    </UiProvider>
  );
}
