import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import ServiceSalesCreate from "./serviceSalesOrder/serviceSales/create";

export function ServiceSalesPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/sales-management/ordermanagement"
        to="/sales-management/ordermanagement/salesquotation"
      />

      <ContentRoute
        from="/sales-management/servicesales/servsalesorder/create"
        component={ServiceSalesCreate}
      />

      <ContentRoute
        from="/sales-management/servicesales/servsalesorder"
        component={() => <h1>Working</h1>}
      />
    </Switch>
  );
}
