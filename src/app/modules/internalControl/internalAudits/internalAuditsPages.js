import React, { lazy, Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import AuditSchedules from "./auditschedules";
import AuditSchedulesEntry from "./auditschedules/entry";
import AuditSchedulesView from "./auditschedules/view";
const AuditReportPage = lazy(() => import("./auditReport/landing"));

export function InternalAuditsPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/internal-control/internalaudits"
          to="/internal-control/internalaudits/auditschedules"
        />
        <ContentRoute
          path="/internal-control/internalaudits/auditschedules/view"
          component={AuditSchedulesView}
        />
        <ContentRoute
          path="/internal-control/internalaudits/auditschedules/entry"
          component={AuditSchedulesEntry}
        />
        <ContentRoute
          path="/internal-control/internalaudits/auditschedules"
          component={AuditSchedules}
        />
        {/* Audit Report */}
        <ContentRoute
          path="/internal-control/internalaudits/auditreport"
          component={AuditReportPage}
        />
      </Switch>
    </Suspense>
  );
}
