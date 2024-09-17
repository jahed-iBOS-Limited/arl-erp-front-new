import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import DisplayPackerInfo from "./displayPackerInfo";
import FuelRequisitionByShipment from "./fuelRequisitionByShip";
import LoadingSupervisorInfo from "./loadingSupervisorInfo";
import PackingInformationList from "./packingInformationList";
import StoreInformationList from "./storeInformationList";

export function TransportDeliveryProcessPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/transport-management"
          to="/transport-management/deliveryprocess"
        />
        <ContentRoute
          path="/transport-management/deliveryprocess/FuelRequisitionByShipment"
          component={FuelRequisitionByShipment}
        />
        <ContentRoute
          path="/transport-management/deliveryprocess/PackingInformationList"
          component={PackingInformationList}
        />
        <ContentRoute
          path="/transport-management/deliveryprocess/LoadingSupervisorInfo"
          component={LoadingSupervisorInfo}
        />
        <ContentRoute
          path="/transport-management/deliveryprocess/StoreInformationList"
          component={StoreInformationList}
        />
        <ContentRoute
          path="/transport-management/deliveryprocess/DisplayPackerInfo"
          component={DisplayPackerInfo}
        />
      </Switch>
    </Suspense>
  );
}

export default TransportDeliveryProcessPages;
