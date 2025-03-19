import React from "react";
import { TransportRouteTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { Route } from "react-router-dom";
import  ViewForm  from "./View/viewModal";

export  function TransportRoute({ history }) {
  const uIEvents = {
    openExtendPage: (id) => {
      history.push(
        `/transport-management/configuration/transportroute/extend/${id}`
      );
    },
    openViewDialog: (id) => {
      history.push(`/transport-management/configuration/transportroute/view/${id}`);
    },
  };
  return (
    <UiProvider uIEvents={uIEvents}>
      <Route path="/transport-management/configuration/transportroute/view/:id">
        {({ history, match }) => (
          <ViewForm
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/transport-management/configuration/transportroute");
            }}
          />
        )}
      </Route>
      <TransportRouteTable />
    </UiProvider>
  );
}
