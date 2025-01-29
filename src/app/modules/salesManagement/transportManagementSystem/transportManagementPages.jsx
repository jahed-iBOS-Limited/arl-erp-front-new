import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import Shipping from "./shipping";
import ShipmentForm from "./shipping/Form/addEditForm";
import { AvailableVehicle } from "./vehicleAvailableReport/Table/tableHeader";

export function TransportManagementPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/sales-management/transportmanagement"
        to="/sales-management/transportmanagement/shipping"
      />
      <ContentRoute
        from="/sales-management/transportmanagement/shipping/edit/:id"
        component={ShipmentForm}
      />
      <ContentRoute
        from="/sales-management/transportmanagement/shipping/add"
        component={ShipmentForm}
      />

      <ContentRoute
        from="/sales-management/transportmanagement/shipping"
        component={Shipping}
      />

      <ContentRoute
        from="/sales-management/transportmanagement/shipping"
        component={Shipping}
      />
      {/* vehicle availabel report route start */}
      <ContentRoute
        from="/sales-management/transportmanagement/vehiclereport"
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
    </Switch>
  );
}
