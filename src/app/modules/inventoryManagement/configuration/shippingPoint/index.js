import React from "react";
import { ShippingPointTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { Route } from "react-router-dom";
import ViewForm from "./View/viewModal";
import AddLatLong from "./Table/addLatLong";

export default function ShippingPoint({ history }) {
  const uIEvents = {
    openExtendPage: (id) => {
      history.push(
        `/inventory-management/configuration/shippingpoint/extend/${id}`
      );
    },
    openViewDialog: (id) => {
      history.push(
        `/inventory-management/configuration/shippingpoint/view/${id}`
      );
    },
    openEditPage: (id) => {
      history.push(
        `/inventory-management/configuration/shippingpoint/latLong/${id}`
      );
    },
  };
  return (
    <UiProvider uIEvents={uIEvents}>
      <Route path="/inventory-management/configuration/shippingpoint/view/:id">
        {({ history, match }) => (
          <ViewForm
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/inventory-management/configuration/shippingpoint");
            }}
          />
        )}
      </Route>
      <Route path="/inventory-management/configuration/shippingpoint/latLong/:id">
        {({ history, match }) => (
          <AddLatLong
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/inventory-management/configuration/shippingpoint");
            }}
          />
        )}
      </Route>
      <ShippingPointTable />
    </UiProvider>
  );
}
