import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import { InternalControlBudgetPages } from "./budget/budgetPages";
import BudgetVarianceReportPages from "./budgetVarianceReports/budgetVarianceReportPages";
import { InternalControlConfigurationPages } from "./configuration/configurationPages";
import InternalControlRevenueCenterPages from "./revenueCenter/revenueCenterPages";
import { InternalAuditsPages } from "./internalAudits/internalAuditsPages";

export function InternalControlPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/internal-control"
          to="/internal-control/configuration/profitcenter"
        />

        <ContentRoute
          path="/internal-control/configuration"
          component={InternalControlConfigurationPages}
        />
        <ContentRoute
          path="/internal-control/budgetvariancereport"
          component={BudgetVarianceReportPages}
        />

        <ContentRoute
          path="/internal-control/revenuecenter"
          component={InternalControlRevenueCenterPages}
        />

        <ContentRoute
          path="/internal-control/budget"
          component={InternalControlBudgetPages}
        />
        <ContentRoute
          path="/internal-control/internalaudits"
          component={InternalAuditsPages}
        />
      </Switch>
    </Suspense>
  );
}

export default InternalControlPages;
