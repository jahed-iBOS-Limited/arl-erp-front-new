import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";

export function AcclFactoryReportPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/production-management"
        to="/production-management/accl-factory-report"
      />

      <ContentRoute
        path="/production-management/accl-factory-report/Cargo-Unloading-Summary"
        component={() => <h1>Working</h1>}
      />
    </Switch>
  );
}
