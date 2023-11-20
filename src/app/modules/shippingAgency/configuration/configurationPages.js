import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import RegistrationLanding from "./registration/landing";
import ExpenseParticulars from "./expenseParticulars";
import EstimatePDACreate from "./registration/Create";

export function ConfigurationPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from='/ShippingAgency'
        to='/ShippingAgency/Configuration'
      />
      <ContentRoute
        path='/ShippingAgency/Configuration/Registration/Create'
        component={EstimatePDACreate}
      />
      <ContentRoute
        path='/ShippingAgency/Configuration/Registration'
        component={RegistrationLanding}
      />
      <ContentRoute
        path='/ShippingAgency/Configuration/ExpenseParticulars'
        component={ExpenseParticulars}
      />
    </Switch>
  );
}
export default ConfigurationPages;
