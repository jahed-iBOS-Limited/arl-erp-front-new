import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";
import { PerformanceCoachingPages } from "./performanceCoaching/performanceCoachingPages";
import { PerformancePlanningPages } from "./performancePlanning/performancePlanningPages";
import { ReportPages } from "./report/reportPages";

export function HashPerformanceMgtPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/MgmtOfPerformance"
          to="/MgmtOfPerformance/PerformancePlanning"
        />

        {/* PerformancePlanning */}

        <ContentRoute
          path="/MgmtOfPerformance/PerformancePlanning"
          component={PerformancePlanningPages}
        />
        <ContentRoute
          path="/MgmtOfPerformance/PerformanceCoaching"
          component={PerformanceCoachingPages}
        />

        {/* Report */}

        <ContentRoute
          path="/MgmtOfPerformance/Report"
          component={ReportPages}
        />
      </Switch>
    </Suspense>
  );
}

export default HashPerformanceMgtPages;
