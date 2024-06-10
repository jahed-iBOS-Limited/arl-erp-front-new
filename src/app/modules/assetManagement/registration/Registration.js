import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import { AssetListPage } from "./assetList";
import { AssetParkingPage } from "./assetParking";
import { CWIPassetParkingPage } from "./CWIPassetParking";
import LandRegister from "./landRegister";
import CreateLandRegister from "./landRegister/CreateLandRegister";

export function RegistrationPages() {
  return (
    <Switch>
      <Redirect exact={true} from="/mngAsset" to="/mngAsset/registration" />

      {/* Asset Parking */}
      <ContentRoute
        from="/mngAsset/registration/assetparking"
        component={AssetParkingPage}
      />
      <ContentRoute
        from="/mngAsset/registration/LandRegister/create"
        component={CreateLandRegister}
      />
      <ContentRoute
        from="/mngAsset/registration/LandRegister"
        component={LandRegister}
      />
      {/* CWIP Asset Parking */}
      <ContentRoute
        from="/mngAsset/registration/cwipAssetParking"
        component={CWIPassetParkingPage}
      />

      {/* Asset List */}
      <ContentRoute
        from="/mngAsset/registration/assetlist"
        component={AssetListPage}
      />
    </Switch>
  );
}
