import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import { InternalControlBudgetPages } from "./budget/budgetPages";
import BudgetVarianceReportPages from "./budgetVarianceReports/budgetVarianceReportPages";
import { InternalControlConfigurationPages } from "./configuration/configurationPages";
import InternalControlRevenueCenterPages from "./revenueCenter/revenueCenterPages";
import { InternalAuditsPages } from "./internalAudits/internalAuditsPages";
import CostingPricingModel from "./costingPricingModel/costConfiguration";
import CostCalculationLanding from "./costingPricingModel/costCalculation/costCalculationMainIndex";
import CostConfigurationCreateEdit from "./costingPricingModel/costCalculation/createEdit";
import ProductToFG from "./costingPricingModel/costConfiguration/product/productToFG";
import ProductToRM from "./costingPricingModel/costConfiguration/product/productToRM";

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
        <ContentRoute
          path="/internal-control/costing/costingconfiguration/product-to-fg"
          component={ProductToFG}
        />
        <ContentRoute
          path="/internal-control/costing/costingconfiguration/product-to-rm"
          component={ProductToRM}
        />
        <ContentRoute
          path="/internal-control/costing/costingconfiguration"
          component={CostingPricingModel}
        />
        <ContentRoute
          path="/internal-control/costing/costingcalculation/create"
          component={CostConfigurationCreateEdit}
        />
        <ContentRoute
          path="/internal-control/costing/costingcalculation"
          component={CostCalculationLanding}
        />
      </Switch>
    </Suspense>
  );
}

export default InternalControlPages;
