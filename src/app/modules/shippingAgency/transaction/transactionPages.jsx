import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import EstimatePDALanding from "./estimatePDA/landing";
import EstimatePDACreate from "./estimatePDA/Create";
import AgencyIncomeLanding from "./agencyIncome/landing";

export function TransactionPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from='/ShippingAgency'
        to='/ShippingAgency/Transaction'
      />
      <ContentRoute
        path='/ShippingAgency/Transaction/EstimatePDA/edit/:editId'
        component={EstimatePDACreate}
      />  <ContentRoute
        path='/ShippingAgency/Transaction/EstimatePDA/Create'
        component={EstimatePDACreate}
      />
      <ContentRoute
        path='/ShippingAgency/Transaction/EstimatePDA'
        component={EstimatePDALanding}
      />{" "}
       <ContentRoute
        path='/ShippingAgency/Transaction/agency-income'
        component={AgencyIncomeLanding}
      />{" "}
    </Switch>
  );
}
export default TransactionPages;
