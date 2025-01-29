import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import { AssetAssignReport } from "./assetAssign";
import { MaintenanceReport } from "./maintenance/index";
import AssetList from "./assetList/index"
import AssetDepreciationPBI from "./assetDepreciation(BI)";
import HistoryAssetDepreciation from "./HistoryAssetDepreciation";
import { shallowEqual, useSelector } from "react-redux";
import NotPermitted from "../../performanceManagement/notPermittedPage/notPermitted";
import AssetDepreciationHistoryView from "./HistoryAssetDepreciation/view";
import VehicleExpireStatus from "./expireStatus";
export function ReportsPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let assetDepreciation = null;
  let vehicleExpireReportPermission = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1258) {
      assetDepreciation = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1269) {
      vehicleExpireReportPermission = userRole[i];
    }
  }

  return (
    <Switch>
      <Redirect exact={true} from="/mngAsset/report" to="/mngAsset/report" />

      {/* Asset Assign */}
      <ContentRoute
        from="/mngAsset/report/asset-Assign"
        component={AssetAssignReport}
      />
      <ContentRoute
        from="/mngAsset/report/maintanceReport"
        component={MaintenanceReport}
      />
      <ContentRoute
        from="/mngAsset/report/asset-List"
        component={AssetList}
      />
      <ContentRoute
        from="/mngAsset/report/AssetDepreciationReport"
        component={AssetDepreciationPBI}
      />
      <ContentRoute
        from="/mngAsset/report/HistoryAssetDepreciation/view/:id"
        component={assetDepreciation?.isView ? AssetDepreciationHistoryView : NotPermitted}
      />
      <ContentRoute
        from="/mngAsset/report/HistoryAssetDepreciation"
        component={assetDepreciation?.isView ? HistoryAssetDepreciation : NotPermitted}
      />
      <ContentRoute
        from="/mngAsset/report/RenewalExpireStatus"
        component={vehicleExpireReportPermission?.isView ? VehicleExpireStatus : NotPermitted}
      />
    </Switch>
  );
}
