import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import TransportExpenseReport from "./transportExpenseReport";
import MapView from "./transportExpenseReport/mapView";

export function StuffTransportPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/transport-management"
        to="/transport-management/stuffreport"
      />
     <ContentRoute
        from="/transport-management/stuffreport/transportexpansereport/mapView"
        component={MapView}
      />
      <ContentRoute
        from="/transport-management/stuffreport/transportexpansereport"
        component={TransportExpenseReport}
      />
    </Switch>
  );
}
