import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import { CustomerCollectionLanding } from "./customerCollection/Table/tableHeader";
// import { RouteSetupLanding } from "./routeSetup";
import OutletBillProcessLanding from "./outletBillProcess/landing/table";

export function AccountReceivablePages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/accountReceivable"
        to="/rtm-management/accountReceivable"
      />

      {/* Customer Collection */}
      <ContentRoute
        path="/rtm-management/accountReceivable/customerCollection"
        component={CustomerCollectionLanding}
      />

      {/* Outlet Bill Process */}
      <ContentRoute
        path="/rtm-management/accountReceivable/outletBillProcess"
        component={OutletBillProcessLanding}
      />
    </Switch>
  );
}
export default AccountReceivablePages;
