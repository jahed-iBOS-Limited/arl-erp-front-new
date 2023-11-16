import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import EstimatePDA from "./estimatePDA";

export function TransactionPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from='/ShippingAgency'
        to='/ShippingAgency/Transaction'
      />

      <ContentRoute
        path='/ShippingAgency/Transaction/EstimatePDA'
        component={EstimatePDA}
      />
    </Switch>
  );
}
export default TransactionPages;
