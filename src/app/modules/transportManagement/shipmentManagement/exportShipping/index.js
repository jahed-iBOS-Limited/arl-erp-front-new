import React from "react";
import { ShipmentTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { Route } from "react-router-dom";
import { ViewModal } from "./shippingUnitView/ViewModal";
import IncompleteViewModal from "./incompletgeShippingUnitView/ViewModal";
import IViewModal from "../../../_helper/_viewModal";
import VehicleWeight from "./vehicleWeigth/vehicleWeight";
// import { IncompleteViewModal } from "./incompletgeShippingUnitView/ViewModal";

export default function ExportShipping({ history }) {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <Route path="/transport-management/shipmentmanagement/exportshipping/view/:id/:shipmentCode">
        {({ history, match }) => (
          <ViewModal
            show={match != null}
            id={match && match.params.id}
            shipmentCode={match && match.params.shipmentCode}
            history={history}
            onHide={() => {
              history.push("/transport-management/shipmentmanagement/exportshipping");
            }}
          />
        )}
      </Route>
      <Route path="/transport-management/shipmentmanagement/exportshipping/incompleteView/:id">
        {({ history, match }) => (
          <IncompleteViewModal
            show={match != null}
            id={match && match.params.id}
            // shipmentCode={match && match.params.shipmentCode}
            history={history}
            onHide={() => {
              history.push("/transport-management/shipmentmanagement/exportshipping");
            }}
          />
        )}
      </Route>
      <Route path="/transport-management/shipmentmanagement/exportshipping/vihicleWeight/:id">
        {({ history, match }) => (
          <IViewModal
            show={match != null}
            history={history}
            onHide={() => {
              history.push("/transport-management/shipmentmanagement/exportshipping");
            }}
          >
            <VehicleWeight id={match && match.params.id} />
          </IViewModal>
        )}
      </Route>
      <ShipmentTable />
    </UiProvider>
  );
}
