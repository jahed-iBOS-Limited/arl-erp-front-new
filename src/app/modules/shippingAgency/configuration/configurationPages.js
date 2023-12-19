import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import ExpenseParticularsCreate from "./expenseParticulars/Create";
import ExpenseParticularsLanding from "./expenseParticulars/landing";
import EstimatePDACreate from "./registration/Create";
import RegistrationLanding from "./registration/landing";
import ShippingAgencyLanding from "./shippingAgency Config";
import ShippingAgencyCreateEditForm from "./shippingAgency Config/create";

export function ConfigurationPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from='/ShippingAgency'
        to='/ShippingAgency/Configuration'
      />
      <ContentRoute
        path='/ShippingAgency/Configuration/Registration/view/:viewId'
        component={EstimatePDACreate}
      />{" "}
      <ContentRoute
        path='/ShippingAgency/Configuration/Registration/edit/:editId'
        component={EstimatePDACreate}
      />{" "}
      <ContentRoute
        path='/ShippingAgency/Configuration/Registration/Create'
        component={EstimatePDACreate}
      />
      <ContentRoute
        path='/ShippingAgency/Configuration/Registration'
        component={RegistrationLanding}
      />
      <ContentRoute
        path='/ShippingAgency/Configuration/ExpenseParticulars/edit/:editId'
        component={ExpenseParticularsCreate}
      />
      <ContentRoute
        path='/ShippingAgency/Configuration/ExpenseParticulars/Create'
        component={ExpenseParticularsCreate}
      />{" "}
      <ContentRoute
        path='/ShippingAgency/Configuration/ExpenseParticulars'
        component={ExpenseParticularsLanding}
      />
      <ContentRoute
        path='/ShippingAgency/Configuration/ShippingAgencyConfig/edit/:id'
        component={ShippingAgencyCreateEditForm}
      />
      <ContentRoute
        path='/ShippingAgency/Configuration/ShippingAgencyConfig/create'
        component={ShippingAgencyCreateEditForm}
      />
      <ContentRoute
        path='/ShippingAgency/Configuration/ShippingAgencyConfig'
        component={ShippingAgencyLanding}
      />
    </Switch>
  );
}
export default ConfigurationPages;
