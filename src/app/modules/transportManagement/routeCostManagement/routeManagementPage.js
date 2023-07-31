import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { Suspense } from "react";
import VehicleLogBookForm from "./vehicleLog/Form/addEditForm";
import VehicleLogExpenseForm from "./vehicleLog/expenseForm/addEditForm";
import { ShipmentCostTable } from "./shipmentCost/Table/tableHeader";
import ShipmentCostForm from "./shipmentCost/Form/addEditForm";
import VehicleInOutReportLanding from "./vehicleInOutReport/landing/landing";
import ShipmentCostViewForm from "./shipmentCost/view/addEditForm";
import VehicleLogBookView from "./vehicleLog/view/addEditForm";
import CheckPostForm from "./checkpost/Form/addEditForm";
import { CheckPost } from "./checkpost/index";
import RentalVehilceCostLanding from "./rentalVehilceCost/landing/landing";
import RentalVehicleEdit from "./rentalVehilceCost/Form/addEditForm";
import EmployeeRegisterLanding from "./employeeRegister/Landing";
import EmployeeRegisterForm from "./employeeRegister/Form/addEditForm";
import ShipmentCostEntryLanding from "./shipmentCostEntry/landing";
import ShipmentCostAccountLanding from "./shipmentCostAccount/landing";
import { shallowEqual, useSelector } from "react-redux";
import findIndex from "../../_helper/_findIndex";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import ShipmentCostModifiedTable from "./shipmentCostModified/Table/tableHeader";
import RentalVehilceCostModifiedLanding from "./rentalVehilceCostModified/landing/landing";
import RentalVehicleEditForm from "./rentalVehilceCostModified/Form/addEditForm";
import ShipmentCostCancelLanding from "./shipmentCostCancel";
import RentalVehicleCostEditForm from "./rentalVehilceCost/editForm/addEditForm";
import ManualShipmentCostForm from "./manualShipmentCost/Form/addEditForm";
import { ManualShipmentCostTable } from "./manualShipmentCost/Table/tableHeader";
import FuelLogNExpense from "./fuelLogNExpense/form";
import FuelLogModify from "./fuelLogModify/landing";
import TripCostStatement from "./vehicleTrip/vehicleTrip";
import VehicleProblemEntryForm from "./vehicleLog/problemForm/addEditForm";
import VehicleLogLanding from "./vehicleLog/landing/index";

export function RouteManagementPage() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const vehicleLogPermission = userRole[findIndex(userRole, "Vehicle Log")];
  const shipmentCostPermission = userRole[findIndex(userRole, "Shipment Cost")];
  const checkPostInOutPermission =
    userRole[findIndex(userRole, "Check Post In Out")];

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/transport-management/routecostmanagement"
          to="/transport-management/routecostmanagement/routestandardcost"
        />

        {/* Vehicle Log Book */}
        <ContentRoute
          path="/transport-management/routecostmanagement/routestandardcost/vehicleProblem"
          component={VehicleProblemEntryForm}
        />
        <ContentRoute
          path="/transport-management/routecostmanagement/routestandardcost/vehicleLogExpense/create"
          component={VehicleLogExpenseForm}
        />
        <ContentRoute
          path="/transport-management/routecostmanagement/routestandardcost/view/:id"
          component={
            vehicleLogPermission?.isView ? VehicleLogBookView : NotPermittedPage
          }
        />
        <ContentRoute
          path="/transport-management/routecostmanagement/routestandardcost/edit/:id"
          component={
            vehicleLogPermission?.isEdit ? VehicleLogBookForm : NotPermittedPage
          }
        />
        <ContentRoute
          path="/transport-management/routecostmanagement/routestandardcost/create"
          component={
            vehicleLogPermission?.isCreate
              ? VehicleLogBookForm
              : NotPermittedPage
          }
        />
        <ContentRoute
          path="/transport-management/routecostmanagement/routestandardcost"
          component={VehicleLogLanding}
        />

        {/* Shipment Cost */}
        <ContentRoute
          path="/transport-management/routecostmanagement/shipmentcost/view/:id"
          component={
            shipmentCostPermission?.isView
              ? ShipmentCostViewForm
              : NotPermittedPage
          }
        />

        <ContentRoute
          path="/transport-management/routecostmanagement/shipmentcost/edit/:id"
          component={
            shipmentCostPermission?.isEdit ? ShipmentCostForm : NotPermittedPage
          }
        />

        <ContentRoute
          path="/transport-management/routecostmanagement/shipmentcost/create"
          component={
            shipmentCostPermission?.isCreate
              ? ShipmentCostForm
              : NotPermittedPage
          }
        />

        <ContentRoute
          path="/transport-management/routecostmanagement/shipmentcost"
          component={ShipmentCostTable}
        />
        <ContentRoute
          path="/transport-management/routecostmanagement/shipmentcostModified"
          component={ShipmentCostModifiedTable}
        />

        {/* VehicleInOutReportLanding */}
        <ContentRoute
          path="/transport-management/routecostmanagement/vehicleinoutreport"
          component={VehicleInOutReportLanding}
        />

        {/* Check Post */}
        <ContentRoute
          path="/transport-management/routecostmanagement/checkpost/view/:id"
          component={
            checkPostInOutPermission?.isView ? CheckPostForm : NotPermittedPage
          }
        />
        <ContentRoute
          path="/transport-management/routecostmanagement/checkpost/add"
          component={
            checkPostInOutPermission?.isCreate
              ? CheckPostForm
              : NotPermittedPage
          }
        />
        <ContentRoute
          path="/transport-management/routecostmanagement/checkpost"
          component={CheckPost}
        />
        {/* Rental Vehilce Cost */}
        <ContentRoute
          path="/transport-management/routecostmanagement/rentalVehicleCost/pending/:pending"
          component={RentalVehicleEdit}
        />
        <ContentRoute
          path="/transport-management/routecostmanagement/rentalVehicleCost/edit/:id"
          component={RentalVehicleCostEditForm}
        />
        <ContentRoute
          path="/transport-management/routecostmanagement/rentalVehicleCost"
          component={RentalVehilceCostLanding}
        />

        {/* Employee Register */}
        <ContentRoute
          path="/transport-management/routecostmanagement/employeeRegister/create"
          component={EmployeeRegisterForm}
        />
        <ContentRoute
          path="/transport-management/routecostmanagement/employeeRegister"
          component={EmployeeRegisterLanding}
        />

        {/* Shipment Cost Entry */}
        <ContentRoute
          path="/transport-management/routecostmanagement/shipmentCostAudit"
          component={ShipmentCostEntryLanding}
        />
        {/* Shipment Cost Account */}
        <ContentRoute
          path="/transport-management/routecostmanagement/shipmentCostAccount"
          component={ShipmentCostAccountLanding}
        />

        <ContentRoute
          path="/transport-management/routecostmanagement/rentalVehicleCostModified/edit/:id"
          component={RentalVehicleEditForm}
        />
        <ContentRoute
          path="/transport-management/routecostmanagement/rentalVehicleCostModified"
          component={RentalVehilceCostModifiedLanding}
        />
        {/* Shipment Cost Cancel */}
        <ContentRoute
          path="/transport-management/routecostmanagement/shipmentCostCancel"
          component={ShipmentCostCancelLanding}
        />

        <ContentRoute
          path="/transport-management/routecostmanagement/shipmentcostManual/create"
          component={ManualShipmentCostForm}
        />
        <ContentRoute
          path="/transport-management/routecostmanagement/shipmentcostManual"
          component={ManualShipmentCostTable}
        />

        <ContentRoute
          path="/transport-management/routecostmanagement/fuellognexpense"
          component={FuelLogNExpense}
        />
        <ContentRoute
          path="/transport-management/routecostmanagement/routevehiclelogmodify"
          component={FuelLogModify}
        />
        <ContentRoute
          path="/transport-management/routecostmanagement/vehicletrip"
          component={TripCostStatement}
        />
      </Switch>
    </Suspense>
  );
}

export default RouteManagementPage;
