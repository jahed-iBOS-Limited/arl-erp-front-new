import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import AuditSchedules from "./auditschedules";
import AuditSchedulesEntry from "./auditschedules/entry";

export function InternalAuditsPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/internal-control/internalaudits"
        to="/internal-control/internalaudits/auditschedules"
      />
      <ContentRoute
        path="/internal-control/internalaudits/auditschedules/entry"
        component={AuditSchedulesEntry}
      />
      <ContentRoute
        path="/internal-control/internalaudits/auditschedules"
        component={AuditSchedules}
      />
    </Switch>
  );
}
