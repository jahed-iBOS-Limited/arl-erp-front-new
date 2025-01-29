import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import { OverTimeManagementPages } from "./overTimeManagement/overTimeManagementPages";
import { ReportPages } from "./report/ReportPages";
export function HumanCapitalManagementPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <div className="hcm-module">
        <Switch>
          <Redirect
            exact={true}
            from="/human-capital-management"
            to="/human-capital-management/overtime-management"
          />

          <ContentRoute
            path="/human-capital-management/overtime-management"
            component={OverTimeManagementPages}
          />
          <ContentRoute
            path="/human-capital-management/report"
            component={ReportPages}
          />
        </Switch>
      </div>
    </Suspense>
  );
}

export default HumanCapitalManagementPages;
