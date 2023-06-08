import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import ReportsPages from "./reports/reportsPages";

export default function PowerBIPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect exact={true} from="/powerbi" to="/powerbi/reports" />

        <ContentRoute path="/powerbi/reports" component={ReportsPages} />
      </Switch>
    </Suspense>
  );
}
