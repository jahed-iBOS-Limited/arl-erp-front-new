import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { ContentRoute } from '../../../../_metronic/layout';
import AirOpsBookingList from './bookingList';

export function AirOperationPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/cargoManagement"
        to="/cargoManagement/operation"
      />
      <ContentRoute
        path="/cargoManagement/air-operation/bookingList"
        component={AirOpsBookingList}
      />
    </Switch>
  );
}
export default AirOperationPages;
