import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import ActionPlanGrowModel from "./actionPlanGrowModel/landing";
import ActionPlanJohariWindow from "./actionPlanJohariWindow/landing";
import GrowModel from "./growModel/landing/table";
import JohariWindowLanding from "./johariWindow/landing";

export function PerformanceCoachingPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/MgmtOfPerformance/PerformanceCoaching"
        to="/MgmtOfPerformance/PerformanceCoaching"
      />

      <ContentRoute
        from="/MgmtOfPerformance/PerformanceCoaching/ActionPlanJohariWindow"
        component={ActionPlanJohariWindow}
      />

      <ContentRoute
        from="/MgmtOfPerformance/PerformanceCoaching/ActionPlanGROWModel"
        component={ActionPlanGrowModel}
      />

      {/* Grow Model */}
      <ContentRoute
        from="/MgmtOfPerformance/PerformanceCoaching/GROWModel"
        component={GrowModel}
      />
      <ContentRoute
        from="/MgmtOfPerformance/PerformanceCoaching/ActionPlanGROWModel"
        component={ActionPlanGrowModel}
      />

      <ContentRoute
        from="/MgmtOfPerformance/PerformanceCoaching/JohariWindow"
        component={JohariWindowLanding}
      />
    </Switch>
  );
}
