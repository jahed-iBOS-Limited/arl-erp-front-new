import React from "react";
import { ActivityGroupLandingCard } from "./activityGroup/activityGroupLandingCard";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { Route } from "react-router-dom";
import { ViewModal } from "./viewModal/viewModal";

export function ActivityGroup({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/config/domain-controll/activity-group/edit/${id}`);
    },
    openViewDialog: (id) => {
      history.push(`/config/domain-controll/activity-group/view/${id}`);
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <Route path="/config/domain-controll/activity-group/view/:id">
        {({ history, match }) => (
          <ViewModal
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/config/domain-controll/activity-group");
            }}
          />
        )}
      </Route>
      <ActivityGroupLandingCard />
    </UiProvider>
  );
}
