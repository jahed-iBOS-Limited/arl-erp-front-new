import React from "react";
import { Route } from "react-router-dom";
import { ViewModal } from "./businessUnitView/viewModal";
import { BusinessUnitLandingCard } from "./businessUnitTable/businessUnitLandingCard";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function BusinessUnit({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/config/domain-controll/business-unit/edit/${id}`);
    },
    openViewDialog: (id) => {
      history.push(`/config/domain-controll/business-unit/view/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <Route path="/config/domain-controll/business-unit/view/:id">
        {({ history, match }) => (
          <ViewModal
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/config/domain-controll/business-unit")
            }} />
        )}
      </Route>
      <BusinessUnitLandingCard />
    </UiProvider>
  );
}
