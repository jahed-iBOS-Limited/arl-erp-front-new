import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";
import { Suspense } from "react";
import { ApprovalPages } from "./approval/Approval";
import { ReportsPages } from "./reports/reportsPages";


export function PersonalPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect exact={true} from='/personal' to='/personal/approval' />

        {/* Asset Receive */}
        <ContentRoute path='/personal/report' component={ReportsPages} />

        <ContentRoute path='/personal/approval' component={ApprovalPages} />
        
      </Switch>
    </Suspense>
  );
}
export default PersonalPages;
