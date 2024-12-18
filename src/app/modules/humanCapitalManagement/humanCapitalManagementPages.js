import React, { Suspense } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { ContentRoute, LayoutSplashScreen } from '../../../_metronic/layout';
import { OverTimeManagementPages } from './overTimeManagement/overTimeManagementPages';
export function HumanCapitalManagementPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <div className="hcm-module">
        <Switch>
          <Redirect
            exact={true}
            from="/human-capital-management"
            to="/human-capital-management/overtime-management"
          />

          <ContentRoute
            path="/human-capital-management/overtime-management"
            component={OverTimeManagementPages}
          />
        </Switch>
      </div>
    </Suspense>
  );
}

export default HumanCapitalManagementPages;
