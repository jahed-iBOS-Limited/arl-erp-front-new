import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { ContentRoute } from '../../../../_metronic/layout';
import ExpBookingList from './expBookingList';
import ImpBookingList from './impBookingList';
import AirOpsBookingList from '../airOperation/bookingList';

export function OperationPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/cargoManagement"
        to="/cargoManagement/operation"
      />
      <ContentRoute
        path="/cargoManagement/operation/bookingList"
        component={ExpBookingList}
      />
      <ContentRoute
        path="/cargoManagement/operation/import-bookingList"
        component={ImpBookingList}
      />
      <ContentRoute
        path="/cargoManagement/air-operation/bookingList"
        component={AirOpsBookingList}
      />
    </Switch>
  );
}
export default OperationPages;
