import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import EisenhowerMatrix from "./eisenhowerMatrix/landing/table";
import ActionPlan from "./ActionPlan";
import WorkPlanLanding from "./workPlan/landing/table";

export function PerformancePlanningPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/MgmtOfPerformance/PerformancePlanning"
        to="/MgmtOfPerformance/PerformancePlanning"
      />

      {/* Work plan */}
      <ContentRoute
        from="/MgmtOfPerformance/PerformancePlanning/WorkPlan"
        component={WorkPlanLanding}
      />

      {/* Eisenhower Matrix */}
      <ContentRoute
        from="/MgmtOfPerformance/PerformancePlanning/EisenhowerMatrix"
        component={EisenhowerMatrix}
      />

      {/* ActionPlan */}
      <ContentRoute
        from="/MgmtOfPerformance/PerformancePlanning/ActionPlan"
        component={ActionPlan}
      />


    </Switch>
  );
}
