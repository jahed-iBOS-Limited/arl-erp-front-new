import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";
import { Suspense } from "react";
import { ReportPages } from "./report/ReportPages";
import { ApplicationPages } from "./application/ApplicationPages";
import { AccountsPages } from "./accounts/AccountsPages";

export function TrustMgmtPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <div className="hcm-module">
        <Switch>
          <Redirect exact={true} from="/trustmgmt" to="/trustmgmt/application" />
          <ContentRoute
            path="/trustmgmt/report"
            component={ReportPages}
          />
          <ContentRoute
            path="/trustmgmt/application"
            component={ApplicationPages}
          />
          <ContentRoute
            path="/trustmgmt/accounts"
            component={AccountsPages}
          />
        </Switch>
      </div>
    </Suspense>
  );
}

export default TrustMgmtPages;
