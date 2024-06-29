import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";
import { Suspense } from "react";
import RouteManagementPage from "./routeCostManagement/routeManagementPage";
import { ConfigurationPages } from "./configuration/configurationPages";
import { ShipmentManagementPages } from "./shipmentManagement/shipmentManagementPage";
import TransportReportPages from "./report/reportPages";
import { StuffTransportPages } from "./stuffTransport/stuffTransportPages";
import FuelStationReport from "./fuelStationReport";

export function TransportManagementPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/transport-management"
          to="/transport-management/transportorganization"
        />
        {/* configuration Page */}
        <ContentRoute
          path="/transport-management/configuration"
          component={ConfigurationPages}
        />
        -{" "}
        <ContentRoute
          path="/transport-management/stuffreport/fuelstationreport"
          component={FuelStationReport}
        />
        <ContentRoute
          path="/transport-management/stuffreport"
          component={StuffTransportPages}
        />
        - {/* Route Management Page */}
        <ContentRoute
          path="/transport-management/routecostmanagement"
          component={RouteManagementPage}
        />
        {/*Shipment Management Page */}
        <ContentRoute
          path="/transport-management/shipmentmanagement"
          component={ShipmentManagementPages}
        />
        {/* Configuration Management Page */}
        <ContentRoute
          path="/transport-management/configuration"
          component={ConfigurationPages}
        />
        <ContentRoute
          path="/transport-management/report"
          component={TransportReportPages}
        />
      </Switch>
    </Suspense>
  );
}

export default TransportManagementPages;
