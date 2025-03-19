import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import GeneratorRunningHour from "./generatorRunningHour";
import GeneratorRunningHourCreate from "./generatorRunningHour/Form/addEditForm";
import FuelConsumption from "./generatorFuelConsumption";
import FuelConsumptionCreate from "./generatorFuelConsumption/Form/addEditForm";
import REBConsumption from "./rebConsumption";
import REBConsumptionCreate from "./rebConsumption/Form/addEditForm";
import RebShutdown from "./rebShutdown";
import RebShutdownCreate from "./rebShutdown/Form/addEditForm";
import MeltingREBConsumption from "./meltingREBConsumption";
import GeneratorGasConsumptionLanding from "./generatorGasConsumption";
import GeneratorGasConsumptionCreate from "./generatorGasConsumption/addEditForm";

export function MsilElectricalDepartmentPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let rebShutdown = null;
  let fuelConsumption = null;
  let rebConsumption = null;
  let generatorRunningHour = null;
  let meltingREBConsumption = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1085) {
      rebShutdown = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1084) {
      fuelConsumption = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1082) {
      rebConsumption = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1083) {
      generatorRunningHour = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1092) {
      meltingREBConsumption = userRole[i];
    }
  }

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/production-management"
        to="/production-management/msil-Electrical"
      />
      <ContentRoute
        path="/production-management/msil-Electrical/REBShutdown/edit/:id"
        component={rebShutdown?.isEdit ? RebShutdownCreate : NotPermittedPage}
      />
      <ContentRoute
        path="/production-management/msil-Electrical/REBShutdown/create"
        component={rebShutdown?.isCreate ? RebShutdownCreate : NotPermittedPage}
      />
      <ContentRoute
        path="/production-management/msil-Electrical/REBShutdown"
        component={rebShutdown?.isView ? RebShutdown : NotPermittedPage}
      />
      <ContentRoute
        path="/production-management/msil-Electrical/GeneratorFuelConsumption/edit/:id"
        component={
          fuelConsumption?.isEdit ? (selectedBusinessUnit?.value === 4 ? GeneratorGasConsumptionCreate : FuelConsumptionCreate) : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Electrical/GeneratorFuelConsumption/create"
        component={
          fuelConsumption?.isCreate ? (
            [4, 171, 224].includes(selectedBusinessUnit?.value) ? GeneratorGasConsumptionCreate : FuelConsumptionCreate
          ) : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Electrical/GeneratorFuelConsumption"
        // component={fuelConsumption?.isView ? FuelConsumption : NotPermittedPage}
        component={
          fuelConsumption?.isView ? (
            selectedBusinessUnit?.value === 4 ? GeneratorGasConsumptionLanding : FuelConsumption
          ) : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Electrical/REBConsumption/edit/:id"
        component={
          rebConsumption?.isEdit ? REBConsumptionCreate : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Electrical/REBConsumption/create"
        component={
          rebConsumption?.isCreate ? REBConsumptionCreate : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Electrical/REBConsumption"
        component={rebConsumption?.isView ? REBConsumption : NotPermittedPage}
      />
      <ContentRoute
        path="/production-management/msil-Electrical/GeneratorRunningHour/edit/:id"
        component={
          generatorRunningHour?.isEdit
            ? GeneratorRunningHourCreate
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Electrical/GeneratorRunningHour/create"
        component={
          generatorRunningHour?.isCreate
            ? GeneratorRunningHourCreate
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Electrical/GeneratorRunningHour"
        component={
          generatorRunningHour?.isView ? GeneratorRunningHour : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Electrical/MeltingREBConsumption"
        component={
          meltingREBConsumption?.isEdit
            ? MeltingREBConsumption
            : NotPermittedPage
        }
      />
    </Switch>
  );
}
