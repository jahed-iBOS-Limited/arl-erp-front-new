import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import OperationPages from "./operation/operationPages";

export function CargoManagementPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/cargoManagement"
          to="/cargoManagement/operation"
        />
        <ContentRoute
          path="/cargoManagement/operation"
          component={OperationPages}
        />
      </Switch>
    </Suspense>
  );
}
export default CargoManagementPages;
