import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import ServiceSalesCreate from "./serviceSalesOrder/serviceSales/create";
import SalesInvoiceLanding from "./salesInvoice";
import ServiceSalesLanding from "./serviceSalesOrder/serviceSales";
import SalesCollectionLanding from "./salesCollection";

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
        component={ServiceSalesLanding}
      />


      <ContentRoute
        from="/sales-management/servicesales/servsalesinvoice"
        component={SalesInvoiceLanding}
      />
      <ContentRoute
        from="/sales-management/servicesales/servsalescollection"
        component={SalesCollectionLanding}
      />
    </Switch>
  );
}
