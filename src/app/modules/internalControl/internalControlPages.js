import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import { InternalControlBudgetPages } from "./budget/budgetPages";
import BudgetVarianceReport from "./budgetVarianceReports";
import { InternalControlConfigurationPages } from "./configuration/configurationPages";
import InternalControlRevenueCenterPages from "./revenueCenter/revenueCenterPages";

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
          component={BudgetVarianceReport}
        />

        <ContentRoute
          path="/internal-control/revenuecenter"
          component={InternalControlRevenueCenterPages}
        />

        <ContentRoute
          path="/internal-control/budget"
          component={InternalControlBudgetPages}
        />
      </Switch>
    </Suspense>
  );
}

export default InternalControlPages;
