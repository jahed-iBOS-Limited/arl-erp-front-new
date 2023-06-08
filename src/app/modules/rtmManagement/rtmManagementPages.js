import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";
import { Suspense } from "react";
import ConfigurationPages from "./configuration/configurationPages";
import SalesforcePages from "./salesforceManagement/salesforceManagementPages";
import PrimarySalesPages from "./primarySales/primarySalesPages";
import AccountReceivablePages from "./accountReceivable/accountReceivablePages";
import InventoryPages from "./inventory/inventoryPages";
import { RTMReportPages } from "./report/reportPages";

export function RtmManagementPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/rtm-management"
          to="/rtm-management/configuration/route"
        />

        <ContentRoute
          path="/rtm-management/configuration"
          component={ConfigurationPages}
        />
        <ContentRoute
          path="/rtm-management/salesforceManagement"
          component={SalesforcePages}
        />
        <ContentRoute
          path="/rtm-management/primarySale"
          component={PrimarySalesPages}
        />
        <ContentRoute
          path="/rtm-management/accountReceivable"
          component={AccountReceivablePages}
        />
        <ContentRoute
          path="/rtm-management/inventory"
          component={InventoryPages}
        />
        <ContentRoute
          path="/rtm-management/report"
          component={RTMReportPages}
        />
      </Switch>
    </Suspense>
  );
}
export default RtmManagementPages;
