import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { ContentRoute } from '../../../../_metronic/layout';
import ChaShipmentBooking from './chaShipmentBooking';
import CreateChaShipmentBooking from './createChaShipmentBooking';

export function ChaOperationPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/cargoManagement"
        to="/cargoManagement/cha-operation"
      />
      <ContentRoute
        path="/cargoManagement/cha-operation/cha-shipment-booking/edit/:id"
        component={CreateChaShipmentBooking}
      />
      <ContentRoute
        path="/cargoManagement/cha-operation/cha-shipment-booking/create"
        component={CreateChaShipmentBooking}
      />
      <ContentRoute
        path="/cargoManagement/cha-operation/cha-shipment-booking"
        component={ChaShipmentBooking}
      />
    </Switch>
  );
}
export default ChaOperationPages;
