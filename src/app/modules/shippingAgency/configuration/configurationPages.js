import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import Registration from "./registration";
import ExpenseParticulars from "./expenseParticulars";

export function ConfigurationPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from='/ShippingAgency'
        to='/ShippingAgency/Configuration'
      />
      <ContentRoute
        path='/ShippingAgency/Configuration/Registration'
        component={Registration}
      />{" "}
      <ContentRoute
        path='/ShippingAgency/Configuration/ExpenseParticulars'
        component={ExpenseParticulars}
      />
    </Switch>
  );
}
export default ConfigurationPages;
