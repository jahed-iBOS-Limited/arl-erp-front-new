import React from "react";
import { ShipmentTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { Route } from "react-router-dom";
import { ViewModal } from "./shippingUnitView/ViewModal";

export default function RtmShipmentPGI({ history }) {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <Route path="/transport-management/shipmentmanagement/shipping/view/:id/:shipmentCode">
        {({ history, match }) => (
          <ViewModal
            show={match != null}
            id={match && match.params.id}
            shipmentCode={match && match.params.shipmentCode}
            history={history}
            onHide={() => {
              history.push("/transport-management/shipmentmanagement/shipping");
            }}
          />
        )}
      </Route>
      <ShipmentTable />
    </UiProvider>
  );
}
