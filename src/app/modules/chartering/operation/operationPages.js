import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Recap from "./recap";
import RecapCreate from "./recap/create";
import EDPALoadPort from "./edpaLoadPort";
import DeadWeight from "./deadWeight";

export function OperationPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/chartering/operation"
        to="/chartering/operation/dashboard"
      />

      <Route
        path="/chartering/operation/recap/create"
        component={RecapCreate}
      />
      <Route path="/chartering/operation/recap" component={Recap} />
      <Route
        path="/chartering/operation/epdaLoadPort"
        component={EDPALoadPort}
      />
      <Route path="/chartering/operation/piSurvey" component={DeadWeight} />
    </Switch>
  );
}
export default OperationPages;
