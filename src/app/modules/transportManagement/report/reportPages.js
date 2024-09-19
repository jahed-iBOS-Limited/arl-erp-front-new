import React, { lazy, Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import ChallanInformationUpdate from "./challanInformationUpdate/landing";
import Dashboardpdd from "./dashboardpdd";
import DateWiseShipmentCostReport from "./dateWiseShipmentCost/landing/landing";
import DeliveryScheduleplanReport from "./deliveryScheduleplan/landing/landing";
import DeliveryScheduleAssignReport from "./deliveryscheduleassaign/landing/landing";
import ExistingTransportPolicy from "./existingTransportPolicy/landing";
import HourlyDeliveryStatusReport from "./hourlyDeliveryStatus";
import LoadingStatusReport from "./loadingStatusReport";
import LogisticDashBoard from "./logisticDashBoard";
import PermissionForModification from "./permissionForModification/_landing/_landing";
import ProductWiseShipmentReport from "./productWiseShipmentReport/Table/table";
import SalesOrderSupport from "./salesOrderSupport/landing";
import SheduleNUnshedule from "./sheduleNUnshedule/landing/index";
import ShipmentCancel from "./shipmentCancel/landing";
import ShipmentCostReport from "./shipmentCostReport/landing";
import ShipmentVehicleStatusUpdate from "./shipmentVehicleStatusUpdate/landing";
import TransportSupplierUpdate from "./transportSupplierUpdate/landing";
import TransportZoneRateReportForm from "./transportZoneRate/form/addForm";
import TransportZoneRateReport from "./transportZoneRate/landing/index";
import TransportZoneUpdate from "./transportZoneUpdate/landing";
import TripCostReportReport from "./tripCostReport/landing/landing";
import TripSlabCostReport from "./tripSlabCostReport/landing/table";
import VehicleFuelCostReport from "./vehicleFuelCostReport/landing";
import VehicleFuelReport from "./vehicleFuelReport/landing/landing";
const DeliveryProcessReportPage = lazy(() => import("./deliveryProcessReport"));

export function TransportReportPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/transport-management"
          to="/transport-management/report"
        />
        {/* configuration Page */}
        <ContentRoute
          path="/transport-management/report/shipmentCostReport"
          component={ShipmentCostReport}
        />

        <ContentRoute
          path="/transport-management/report/fuelCostReport"
          component={VehicleFuelCostReport}
        />

        <ContentRoute
          path="/transport-management/report/vehicleFuelReport"
          component={VehicleFuelReport}
        />

        {/* date wise shipment cost */}
        <ContentRoute
          path="/transport-management/report/date-wise-shipment-cost-report"
          component={DateWiseShipmentCostReport}
        />

        {/* Existing Transport Policy */}
        <ContentRoute
          path="/transport-management/report/existing-transport-policy"
          component={ExistingTransportPolicy}
        />

        {/* Trip Cost Report */}
        <ContentRoute
          path="/transport-management/report/tripCostReport"
          component={TripCostReportReport}
        />
        <ContentRoute
          path="/transport-management/report/deliveryscheduleplan"
          component={DeliveryScheduleplanReport}
        />
        <ContentRoute
          path="/transport-management/report/deliveryscheduleassaign"
          component={DeliveryScheduleAssignReport}
        />

        <ContentRoute
          path="/transport-management/report/dashboardpdd"
          component={Dashboardpdd}
        />

        <ContentRoute
          path="/transport-management/report/LogisticDashBoard"
          component={LogisticDashBoard}
        />
        <ContentRoute
          path="/transport-management/report/transportZoneRate/edit/:id"
          component={TransportZoneRateReportForm}
        />
        <ContentRoute
          path="/transport-management/report/transportZoneRate"
          component={TransportZoneRateReport}
        />
        {/* Product Wise Shipment Report */}
        <ContentRoute
          path="/transport-management/report/productWiseShipmentReport"
          component={ProductWiseShipmentReport}
        />

        <ContentRoute
          path="/transport-management/report/tripSlabCostReport"
          component={TripSlabCostReport}
        />
        <ContentRoute
          path="/transport-management/report//customerInformationUpdate"
          component={TransportSupplierUpdate}
        />
        <ContentRoute
          path="/transport-management/report/transportZoneUpdate"
          component={TransportZoneUpdate}
        />
        <ContentRoute
          path="/transport-management/report/challanInformationUpdate"
          component={ChallanInformationUpdate}
        />
        <ContentRoute
          path="/transport-management/report/sheduleNUnshedule"
          component={SheduleNUnshedule}
        />
        <ContentRoute
          path="/transport-management/report/shipmentVehicleStatusUpdate"
          component={ShipmentVehicleStatusUpdate}
        />
        <ContentRoute
          path="/transport-management/report/shipmenInformationUpdate"
          component={ShipmentCancel}
        />
        <ContentRoute
          path="/transport-management/report/salesordersupport"
          component={SalesOrderSupport}
        />
        <ContentRoute
          path="/transport-management/report/permissionformodificaiton"
          component={PermissionForModification}
        />
        <ContentRoute
          path="/transport-management/report/loadingStatusReport"
          component={LoadingStatusReport}
        />
        <ContentRoute
          path="/transport-management/report/hourlyDeliveryStatusReport"
          component={HourlyDeliveryStatusReport}
        />
        {/* Delivery Process Report */}
        <ContentRoute
          path="/transport-management/report/deliveryprocessreport"
          component={DeliveryProcessReportPage}
        />
      </Switch>
    </Suspense>
  );
}

export default TransportReportPages;
