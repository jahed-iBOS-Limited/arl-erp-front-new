import React, { Suspense } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import NotPermittedPage from "../_helper/notPermitted/NotPermittedPage";
import ChaOperationPages from "./chaOperation/chaOperationPage";
import DeliveryAgentPages from "./configuration/configurationPages";
import OperationPages from "./operation/operationPages";
import ReportPages from "./report/reportPages";

export function CargoManagementPages() {
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData || {},
    shallowEqual
  );
  if (selectedBusinessUnit?.value === 225) {
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
    )
  }
  else {
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
            component={NotPermittedPage}
          />
          <ContentRoute
            path="/cargoManagement/report"
            component={NotPermittedPage}
          />
          <ContentRoute
            path="/cargoManagement/configuration"
            component={NotPermittedPage}
          />
          <ContentRoute
            path="/cargoManagement/cha-operation"
            component={NotPermittedPage}
          />
        </Switch>
      </Suspense>
    )
  }
}
export default CargoManagementPages;
