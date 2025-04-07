import React, { Suspense } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Redirect, Switch } from 'react-router-dom';
import { ContentRoute, LayoutSplashScreen } from '../../../_metronic/layout';
import NotPermittedPage from '../_helper/notPermitted/NotPermittedPage';
import ChaOperationPages from './chaOperation/chaOperationPage';
import DeliveryAgentPages from './configuration/configurationPages';
import OperationPages from './ffOperation/operationPages';
import ReportPages from './report/reportPages';
import AirOperationPages from './airOperation/airOperationPages';

export function CargoManagementPages() {
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData || {},
    shallowEqual
  );

  if (selectedBusinessUnit?.value !== 225) {
    return <NotPermittedPage />;
  }
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/cargoManagement"
          to="/cargoManagement/operation"
        />
        <ContentRoute
          path="/cargoManagement/air-operation"
          component={AirOperationPages}
        />
        <ContentRoute
          path="/cargoManagement/operation"
          component={OperationPages}
        />
        <ContentRoute path="/cargoManagement/report" component={ReportPages} />
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
