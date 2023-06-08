import React from "react";
import { Route } from "react-router-dom";
import { ViewModal } from "./roleExtensionView/viewModal";
import { BusinessUnitLandingCard } from "./roleExtensionTable/businessUnitLandingCard";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function RoleExtension({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/config/domain-controll/role-extension/edit/${id}`);
    },
    openViewDialog: (id) => {
      history.push(`/config/domain-controll/role-extension/view/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <Route path="/config/domain-controll/role-extension/view/:id">
        {({ history, match }) => (
          <ViewModal
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/config/domain-controll/role-extension")
            }} />
        )}
      </Route>
      <BusinessUnitLandingCard />
    </UiProvider>
  );
}
