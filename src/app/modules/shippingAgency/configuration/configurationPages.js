import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import RegistrationLanding from "./registration/landing";
import EstimatePDACreate from "./registration/Create";
import ExpenseParticularsLanding from "./expenseParticulars/landing";
import ExpenseParticularsCreate from "./expenseParticulars/Create";

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
        path='/ShippingAgency/Configuration/ExpenseParticulars/Create'
        component={ExpenseParticularsCreate}
      />{" "}
      <ContentRoute
        path='/ShippingAgency/Configuration/ExpenseParticulars'
        component={ExpenseParticularsLanding}
      />
    </Switch>
  );
}
export default ConfigurationPages;
