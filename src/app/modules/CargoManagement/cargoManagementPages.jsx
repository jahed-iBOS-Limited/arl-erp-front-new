import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import DeliveryAgentPages from "./configuration/configurationPages";
import OperationPages from "./operation/operationPages";
import ReportPages from "./report/reportPages";
import ChaOperationPages from "./chaOperation/chaOperationPage";

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
        <ContentRoute
          path="/cargoManagement/report"
          component={ReportPages}
        />
        <ContentRoute
          path="/cargoManagement/configuration"
          component={DeliveryAgentPages}
        />
        <ContentRoute
          path="/cargoManagement/cha-operation"
          component={ChaOperationPages}
        />
      </Switch>
    </Suspense>
  );
}
export default CargoManagementPages;
