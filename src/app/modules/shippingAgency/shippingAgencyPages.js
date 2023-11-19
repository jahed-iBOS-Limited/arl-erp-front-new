import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import ConfigurationPages from "./configuration/configurationPages";
import TransactionPages from "./transaction/transactionPages";

export function ShippingAgencyPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from='/ShippingAgency'
          to='/ShippingAgency/Configuration'
        />
        <ContentRoute
          path='/ShippingAgency/Configuration'
          component={ConfigurationPages}
        />
        <ContentRoute
          path='/ShippingAgency/Transaction'
          component={TransactionPages}
        />
      </Switch>
    </Suspense>
  );
}
export default ShippingAgencyPages;
