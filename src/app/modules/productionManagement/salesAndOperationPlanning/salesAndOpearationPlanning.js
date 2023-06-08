import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import SalesAndProductionPlanCreateForm from "./salesAndProductionPlan/form/addEditForm";
import ProductionPlanningForm from "./salesAndProductionPlan/productionPlanning/addEditForm";
import SalesAndProductionTable from "./salesAndProductionPlan/table/table";
import ProductionMasterSchedulelLanding from "./productionMasterSchedule/Table/index";
import ProductionMasterSchedulelFrom from "./productionMasterSchedule/Form/addEditForm";
import SalesAndProductionPlanCreateFormView from "./salesAndProductionPlan/formView/addEditForm";
import MaterialReqPlanLanding from "./materialReqPlan/table/table";

export function salesAndOperationsPlanning() {
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
    </Switch>
  );
}
