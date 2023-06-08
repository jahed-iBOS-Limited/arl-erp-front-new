import React from "react";
import ValuesAndCompetencyPage from "./Form/addEditForm";
import { UiProvider } from "../../_helper/uiContextHelper";
import { Route } from "react-router-dom";
import ViewModal from "../_helper/_viewModal";

export function ValuesAndCompetencyEmployee({ history }) {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <ValuesAndCompetencyPage />
      <Route path="/performance-management/employee-entry/view">
        {({ history, match }) => (
          <ViewModal
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={(value) => {
              history.push({
                pathname: "/performance-management/employee-entry",
                _data: value && value,
              });
            }}
          />
        )}
      </Route>
    </UiProvider>
  );
}
