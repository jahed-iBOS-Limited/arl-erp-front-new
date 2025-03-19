import React from "react";
import { Route } from "react-router-dom";
import { ViewModal } from "./businessUnitView/viewModal";
import { SBULandingCard } from "./SbuTable/SbuLandingCard";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function Sbu({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/financial-management/configuration/sbu/edit/${id}`);
    },
    openViewDialog: (id) => {
      history.push(`/financial-management/configuration/sbu/view/${id}`);
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <Route path="/financial-management/configuration/sbu/view/:id">
        {({ history, match }) => (
          <ViewModal
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/financial-management/configuration/sbu");
            }}
          />
        )}
      </Route>
      <SBULandingCard />
    </UiProvider>
  );
}
