import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermitted from "../../performanceManagement/notPermittedPage/notPermitted";
import CargoUnloadingStatement from "./cargoUnloadingStatement";
import CargoUnloadingStatementCreate from "./cargoUnloadingStatement/createEdit";
import MillProduction from "./millProduction";
import MillProductionCreateEdit from "./millProduction/createEdit";
import MoustureCreateEdit from "./moistureReport/createEdit";
import MoistureReport from "./moistureReport/report";
import MoistureReportLanding from "./moistureReport/index";
import PowerConsumptionAllsbu from "./powerConsumptionAllSbu";
import PowerConsumptionAllSbuCreate from "./powerConsumptionAllSbu/createEdit";
import PowerPlantReport from "./powerPlantReport";
import ScheduleMaintainence from "./scheduleMaintainence";
import ScheduleMaintainenceCreate from "./scheduleMaintainence/createEdit";
import UnloadingRegister from "./unloadingRegister";
import UnloadingRegisterCreate from "./unloadingRegister/createEdit";
import CranStopage from "./unloadingRegister/cranStopage";

export function AcclFactoryPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let millProduction = null;
  let scheduleMaintainence = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1266) {
      millProduction = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1203) {
      scheduleMaintainence = userRole[i];
    }
  }

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/production-management"
        to="/production-management/ACCLFactory"
      />
      <ContentRoute
        path="/production-management/ACCLFactory/Unloading-Register/createCranStopage"
        component={CranStopage}
      />
      <ContentRoute
        path="/production-management/ACCLFactory/Unloading-Register/edit/:id"
        component={UnloadingRegisterCreate}
      />

      <ContentRoute
        path="/production-management/ACCLFactory/Unloading-Register/create"
        component={UnloadingRegisterCreate}
      />

      <ContentRoute
        path="/production-management/ACCLFactory/Unloading-Register"
        component={UnloadingRegister}
      />
      <ContentRoute
        path="/production-management/ACCLFactory/Cargo-Unloading-Statement/edit/:id"
        component={CargoUnloadingStatementCreate}
      />

      <ContentRoute
        path="/production-management/ACCLFactory/Cargo-Unloading-Statement/create"
        component={CargoUnloadingStatementCreate}
      />

      <ContentRoute
        path="/production-management/ACCLFactory/Cargo-Unloading-Statement"
        component={CargoUnloadingStatement}
      />
      <ContentRoute
        path="/production-management/ACCLFactory/Schedule-Maintenance/create"
        component={
          scheduleMaintainence?.isCreate
            ? ScheduleMaintainenceCreate
            : NotPermitted
        }
      />
      <ContentRoute
        path="/production-management/ACCLFactory/Schedule-Maintenance"
        component={
          scheduleMaintainence?.isView ? ScheduleMaintainence : NotPermitted
        }
      />
      <ContentRoute
        path="/production-management/ACCLFactory/powerConsumptionAllSbu/edit/:id"
        component={PowerConsumptionAllSbuCreate}
      />
      <ContentRoute
        path="/production-management/ACCLFactory/powerConsumptionAllSbu/create"
        component={PowerConsumptionAllSbuCreate}
      />
      <ContentRoute
        path="/production-management/ACCLFactory/powerConsumptionAllSbu"
        component={PowerConsumptionAllsbu}
      />
      <ContentRoute
        path="/production-management/ACCLFactory/power_plant_report"
        component={PowerPlantReport}
      />
      <ContentRoute
        path="/production-management/ACCLFactory/mill-production/edit/:id"
        component={
          millProduction?.isCreate ? MillProductionCreateEdit : NotPermitted
        }
      />
      <ContentRoute
        path="/production-management/ACCLFactory/mill-production/create"
        component={
          millProduction?.isCreate ? MillProductionCreateEdit : NotPermitted
        }
      />
      <ContentRoute
        path="/production-management/ACCLFactory/mill-production"
        component={millProduction?.isView ? MillProduction : NotPermitted}
      />
      {/* moisture report */}
      <ContentRoute
        path="/production-management/ACCLFactory/moistureTest/report"
        component={MoistureReport}
      />
      <ContentRoute
        path="/production-management/ACCLFactory/moistureTest/edit/:id"
        component={MoustureCreateEdit}
      />
      <ContentRoute
        path="/production-management/ACCLFactory/moistureTest/create"
        component={MoustureCreateEdit}
      />
      <ContentRoute
        path="/production-management/ACCLFactory/moistureTest"
        component={MoistureReportLanding}
      />
    </Switch>
  );
}
