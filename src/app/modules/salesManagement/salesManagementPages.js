import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";
import { Suspense } from "react";
import { SalesConfigurationPages } from "./configuration/configurationPages";
import { OrderManagementPages } from "./orderManagement/orderManagementPages";
import { TransportManagementPages } from "./transportManagementSystem/transportManagementPages";
import { ReportManagementPages } from "./report/reportManagementPages";
import { AcclReportPages } from "./acclReport/acclReportPages";
import { ServiceSalesPages } from "./serviceSales/serviceSalesPages";
import { ComplainManagementPages } from "./complainManagement/complainManagementPages";

export function SalesManagementPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from='/sales-management'
          to='/sales-management/configuration/salesorganization'
        />
        <ContentRoute
          path='/sales-management/configuration'
          component={SalesConfigurationPages}
        />
        <ContentRoute
          path='/sales-management/ordermanagement'
          component={OrderManagementPages}
        />
        <ContentRoute
          path='/sales-management/servicesales'
          component={ServiceSalesPages}
        />
        <ContentRoute
          path='/sales-management/transportmanagement'
          component={TransportManagementPages}
        />
        <ContentRoute
          path='/sales-management/report'
          component={ReportManagementPages}
        />
        <ContentRoute
          path='/sales-management/AcclReport'
          component={AcclReportPages}
        />{" "}
        <ContentRoute
          path='/sales-management/complainmanagement'
          component={ComplainManagementPages}
        />
      </Switch>
    </Suspense>
  );
}

export default SalesManagementPages;
