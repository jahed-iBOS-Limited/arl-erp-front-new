import React, { lazy, Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
const AuditSchedules = lazy(() => import("./auditschedules"));
const AuditSchedulesEntry = lazy(() => import("./auditschedules/entry"));
const AuditSchedulesView = lazy(() => import("./auditschedules/view"));
const AuditPlanViewAndPrint = lazy(() => import("./auditReport/auditPlan"));
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
          path="/internal-control/internalaudits/auditreport/view"
          component={AuditPlanViewAndPrint}
        />
        <ContentRoute
          path="/internal-control/internalaudits/auditreport"
          component={AuditReportPage}
        />
      </Switch>
    </Suspense>
  );
}
