import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import { AssetRentManagementPages } from "./assetRentManagement/assetRentManagement";
import { MaintenancePages } from "./maintenance/MaintenancePages";
import { RegistrationPages } from "./registration/Registration";
import { ReportsPages } from "./reports/reportsPages";

export function AssetManagementPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect exact={true} from="/mngAsset" to="/mngAsset/registration" />

        <ContentRoute
          path="/mngAsset/registration"
          component={RegistrationPages}
        />

        <ContentRoute
          path="/mngAsset/maintenance"
          component={MaintenancePages}
        />

        <ContentRoute path="/mngAsset/report" component={ReportsPages} />

        {/* Asset Rent management */}
        <ContentRoute
          path="/mngAsset/assetRentMangmnt"
          component={AssetRentManagementPages}
        />
      </Switch>
    </Suspense>
  );
}
export default AssetManagementPages;
