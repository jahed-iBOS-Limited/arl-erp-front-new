import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import Shipping from "./shipping";
import ShipmentForm from "./shipping/Form/addEditForm";
// import { TripLoadUnload } from "./tripLoadUnload/Table/tableHeader";
import { AvailableVehicle } from "./vehicleAvailableReport/Table/tableHeader";
import TransferShipmentForm from "./transferShipping/Form/addEditForm";
import ShipmentTransferLanding from "./transferShipping/index";
import ChallanShippointTransfer from "./challanShippointTransfer";
import ManualShipment from "./manualShipment";
import ManualShipmentCreate from "./manualShipment/createEdit";
import { shallowEqual, useSelector } from "react-redux";
import NotPermitted from "../../performanceManagement/notPermittedPage/notPermitted";
import ExportShipping from "./exportShipping";
import ExportShipmentForm from "./exportShipping/Form/addEditForm";
import LoadingSlip from "./loadingSlip";

export function ShipmentManagementPages() {

  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let manualShipmentPermission = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1271) {
      manualShipmentPermission = userRole[i];
    }
  }


  return (
    <Switch>
      <Redirect
        exact={true}
        from="/transport-management/shipmentmanagement"
        to="/transport-management/shipmentmanagement/shipping"
      />
      <ContentRoute
        from="/transport-management/shipmentmanagement/shipping/edit/:id"
        component={ShipmentForm}
      />
      <ContentRoute
        from="/transport-management/shipmentmanagement/shipping/add"
        component={ShipmentForm}
      />

      <ContentRoute
        from="/transport-management/shipmentmanagement/shipping"
        component={Shipping}
      />
      <ContentRoute
        from="/transport-management/shipmentmanagement/exportshipping/edit/:id"
        component={ExportShipmentForm}
      />
      <ContentRoute
        from="/transport-management/shipmentmanagement/exportshipping/add"
        component={ExportShipmentForm}
      />

      <ContentRoute
        from="/transport-management/shipmentmanagement/exportshipping"
        component={ExportShipping}
      />
      <ContentRoute
        from="/transport-management/shipmentmanagement/manual-shipment/edit/:loadingId"
        component={manualShipmentPermission?.isEdit ? ManualShipmentCreate : NotPermitted}
      />
      <ContentRoute
        from="/transport-management/shipmentmanagement/manual-shipment/create"
        component={manualShipmentPermission?.isCreate ? ManualShipmentCreate : NotPermitted}
      />
      <ContentRoute
        from="/transport-management/shipmentmanagement/manual-shipment"
        component={manualShipmentPermission?.isView ? ManualShipment : NotPermitted}
      />
      <ContentRoute
        from="/transport-management/shipmentmanagement/challanShippointTransfer"
        component={ChallanShippointTransfer}
      />

      {/* Trip Load Unload */}
      {/* <ContentRoute
        from="/transport-management/shipmentmanagement/tripLoadUnload"
        component={TripLoadUnload}
      /> */}
      {/* vehicle availabel report route start */}
      <ContentRoute
        from="/transport-management/shipmentmanagement/vehiclereport"
        component={AvailableVehicle}
      />
      {/* vehicle availabel report route end */}

      {/* vehicle route start */}
      {/* <ContentRoute
        path="/sales-management/transportmanagement/vehicle/edit/:id"
        component={VehicleForm}
      />
      <ContentRoute
        path="/sales-management/transportmanagement/vehicle/add"
        component={VehicleForm}
      />
      <ContentRoute
        from="/sales-management/transportmanagement/vehicle"
        component={Vehicle}
      /> */}

      {/* checkpost start */}
      {/* <ContentRoute
        path="/sales-management/transportmanagement/checkpost/edit/:id"
        component={CheckPostForm}
      />
      <ContentRoute
        path="/sales-management/transportmanagement/checkpost/add"
        component={CheckPostForm}
      />
      <ContentRoute
        from="/sales-management/transportmanagement/checkpost"
        component={CheckPost}
      /> */}

      {/* Transerfer Shipment */}
      <ContentRoute
        from="/transport-management/shipmentmanagement/transfershipping/edit/:id"
        component={TransferShipmentForm}
      />
      <ContentRoute
        from="/transport-management/shipmentmanagement/transfershipping/add"
        component={TransferShipmentForm}
      />

      <ContentRoute
        from="/transport-management/shipmentmanagement/transfershipping"
        component={ShipmentTransferLanding}
      />
       <ContentRoute
        from="/transport-management/shipmentmanagement/loadingslip"
        component={LoadingSlip}
      />
    </Switch>
  );
}
