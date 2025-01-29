import React from "react";
import { Suspense } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import AelReportLanding from "./report";
import AelReportCreate from "./report/createEdit";

export function AelEventPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  )

  let aelEventCreatePermission = null;
  let aelEventReportPermission = null;

  for (let i = 0; i < userRole.length; i++) {

    if (userRole[i]?.intFeatureId === 1247) { //For Live
      aelEventCreatePermission = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1248) { //For Live
      aelEventReportPermission = userRole[i];
    }
  }
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact
          from="/pos-management"
          to="/pos-management/event/entryAelEvent"
        />
        <ContentRoute
          exact
          path="/pos-management/event/entryAelEvent"
          component={aelEventCreatePermission?.isCreate ? AelReportCreate : NotPermittedPage}
        />
        <ContentRoute
          exact
          path="/pos-management/event/reportAelEvent"
          component={aelEventReportPermission?.isView ? AelReportLanding : NotPermittedPage}
        />
      </Switch>
    </Suspense>
  );
}

export default AelEventPages;
