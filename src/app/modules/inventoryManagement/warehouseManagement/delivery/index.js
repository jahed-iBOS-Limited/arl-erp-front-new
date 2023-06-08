import React from "react";
import { DeliveryTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";
import ViewForm from "./View/viewModal";
import { Route } from "react-router-dom";
import  './style.css'

export function Delivery({ history }) {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <Route path="/inventory-management/warehouse-management/delivery/view/:id">
        {({ history, match }) => (
          <ViewForm
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/inventory-management/warehouse-management/delivery");
            }}
          />
        )}
      </Route>
      <DeliveryTable />
    </UiProvider>
  );
}
