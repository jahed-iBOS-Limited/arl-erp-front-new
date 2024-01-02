import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import TransportExpenseReport from "./transportExpenseReport";

export function StuffTransportPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/transport-management"
        to="/transport-management/stuffreport"
      />

      <ContentRoute
        from="/transport-management/stuffreport/transportexpansereport"
        component={TransportExpenseReport}
      />
    </Switch>
  );
}
