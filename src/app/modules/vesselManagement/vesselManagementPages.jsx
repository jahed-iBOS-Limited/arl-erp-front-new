import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import AllotmentPages from "./allotment/allotmentPages";
import ConfigPages from "./config/configpages";
import ReportPages from "./report/vesselReportPages";

export default function VesselManagementPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/vessel-management"
          to="/vessel-management/allotment"
        />

        <ContentRoute
          path="/vessel-management/allotment"
          component={AllotmentPages}
        />
        <ContentRoute
          path="/vessel-management/configuration"
          component={ConfigPages}
        />
        <ContentRoute
          path="/vessel-management/report"
          component={ReportPages}
        />
      </Switch>
    </Suspense>
  );
}
