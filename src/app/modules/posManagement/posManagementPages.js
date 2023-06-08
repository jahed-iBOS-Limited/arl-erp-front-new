import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";
import { Suspense } from "react";
import SalesInvoicePage from "./salesInvoice/salesInvoicePages";
import ReportPages from "./report/reportPages"
import DamagePages from "./damage/damagePages"
import ConfigurationPages from "./configuration/configurationPages"
import AelEventPages from "./AELEvent/AelEventPages";

export function PosManagementPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/pos-management"
          to="/pos-management/sales"
        />
        <ContentRoute
          path="/pos-management/sales"
          component={SalesInvoicePage}
        />
        <ContentRoute
          path="/pos-management/report"
          component={ReportPages}
        />
        <ContentRoute
          path="/pos-management/configuration"
          component={ConfigurationPages}
        />
        <ContentRoute
          path="/pos-management/damage"
          component={DamagePages}
        />
        <ContentRoute
          path="/pos-management/configuration"
          component={ConfigurationPages}
        />
        <ContentRoute
          path="/pos-management/event"
          component={AelEventPages}
        />
      </Switch>
    </Suspense>
  );
}

export default PosManagementPages;
