import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Recap from "./recap";
import RecapCreate from "./recap/create";

export function OperationPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/chartering/operation"
        to="/chartering/operation/dashboard"
      />

      {/* <Route
        path="/chartering/operation/recap/create"
        component={RecapCreate}
      /> */}
      <Route path="/chartering/operation/recap" component={Recap} />
    </Switch>
  );
}
export default OperationPages;
