import React from "react";
import { Route } from "react-router-dom";
import { ViewModal } from "./businessUnitView/viewModal";
import { PartnerLandingCard } from "./partnerTable/partnerLandingCard";
import { UiProvider } from "../../../_helper/uiContextHelper";

export default function PartnerInformation({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/config/partner-management/partner-basic-info/edit/${id}`);
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <Route path="/config/partner-management/partner-basic-info/view/:id">
        {({ history, match }) => (
          <ViewModal
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/config/partner-management/partner-basic-info");
            }}
          />
        )}
      </Route>
      <PartnerLandingCard />
    </UiProvider>
  );
}
