import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { Suspense } from "react";
import ShipmentCostReport from "./shipmentCostReport/landing";
import VehicleFuelCostReport from "./vehicleFuelCostReport/landing";
import VehicleFuelReport from "./vehicleFuelReport/landing/landing";
import DateWiseShipmentCostReport from "./dateWiseShipmentCost/landing/landing";
import ExistingTransportPolicy from "./existingTransportPolicy/landing";
import TripCostReportReport from "./tripCostReport/landing/landing";
import ShipmentCostReportModified from "./shipmentCostReportModified/landing";
import TransportZoneRateReport from "./transportZoneRate/landing/index";
import ProductWiseShipmentReport from "./productWiseShipmentReport/Table/table";
import TransportZoneRateReportForm from "./transportZoneRate/form/addForm";
import TripSlabCostReport from "./tripSlabCostReport/landing/table";
import TransportSupplierUpdate from "./transportSupplierUpdate/landing";
import ChallanInformationUpdate from "./challanInformationUpdate/landing";
import SheduleNUnshedule from "./sheduleNUnshedule/landing/index";
import TransportZoneUpdate from "./transportZoneUpdate/landing";
import ShipmentVehicleStatusUpdate from "./shipmentVehicleStatusUpdate/landing";
import ShipmentCancel from "./shipmentCancel/landing";
import SalesOrderSupport from "./salesOrderSupport/landing";
import PermissionForModification from "./permissionForModification/_landing/_landing";
import LoadingStatusReport from "./loadingStatusReport";
import HourlyDeliveryStatusReport from "./hourlyDeliveryStatus";
import DeliveryScheduleplanReport from "./deliveryScheduleplan/landing/landing";

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
          path="/transport-management/report/shipmentCostReportModified"
          component={ShipmentCostReportModified}
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
      </Switch>
    </Suspense>
  );
}

export default TransportReportPages;
