/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
// import DistributionPlanEdit from "./distributionPlan/edit";
import Materialannualplan from "./materialReqPlan/table/table";
import MaterialReqPlanLanding from "./materialannualplan/table/table";
import ProductionMasterSchedulelFrom from "./productionMasterSchedule/Form/addEditForm";
import ProductionMasterSchedulelLanding from "./productionMasterSchedule/Table/index";
import SalesAndProductionPlanCreateForm from "./salesAndProductionPlan/form/addEditForm";
import SalesAndProductionPlanCreateFormView from "./salesAndProductionPlan/formView/addEditForm";
import ProductionPlanningForm from "./salesAndProductionPlan/productionPlanning/addEditForm";
import SalesAndProductionTable from "./salesAndProductionPlan/table/table";

export function salesAndOperationsPlanning() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let distributionPlanningPermission = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1328) {
      distributionPlanningPermission = userRole[i];
    }
  }
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/production-management/mes"
        to="/production-management/mes/bill-of-material"
      />
      {/* Sales Plan */}
      <ContentRoute
        from="/production-management/salesAndOperationsPlanning/salesAndProductionPlan/:plantId/:salesPlanId/createPP"
        component={ProductionPlanningForm}
      />
      <ContentRoute
        from="/production-management/salesAndOperationsPlanning/salesAndProductionPlan/view/:viewId"
        component={SalesAndProductionPlanCreateFormView}
      />
      <ContentRoute
        from="/production-management/salesAndOperationsPlanning/salesAndProductionPlan/edit/:id"
        component={SalesAndProductionPlanCreateForm}
      />
      <ContentRoute
        from="/production-management/salesAndOperationsPlanning/salesAndProductionPlan/Create"
        component={SalesAndProductionPlanCreateForm}
      />

      <ContentRoute
        from="/production-management/salesAndOperationsPlanning/salesAndProductionPlan"
        component={SalesAndProductionTable}
      />

      {/* Production Master Schedulel */}
      <ContentRoute
        path="/production-management/salesAndOperationsPlanning/productionMasterSchedule/add"
        component={ProductionMasterSchedulelFrom}
      />
      <ContentRoute
        from="/production-management/salesAndOperationsPlanning/productionMasterSchedule/edit/:id"
        component={ProductionMasterSchedulelFrom}
      />
      <ContentRoute
        path="/production-management/salesAndOperationsPlanning/productionMasterSchedule"
        component={ProductionMasterSchedulelLanding}
      />

      {/* MaterialReqPlan */}
      <ContentRoute
        path="/production-management/salesAndOperationsPlanning/materialReqPlan"
        component={MaterialReqPlanLanding}
      />
      <ContentRoute
        path="/production-management/salesAndOperationsPlanning/materialannualplan"
        component={Materialannualplan}
      />
    </Switch>
  );
}
