/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermitted from "../../performanceManagement/notPermittedPage/notPermitted";
import MonthlySalesPlanLanding from "./detailsSalesPlan";
import DistributionPlanCreateEdit from "./distributionPlan/createEdit";
// import DistributionPlanEdit from "./distributionPlan/edit";
import Materialannualplan from "./materialReqPlan/table/table";
import MaterialReqPlanLanding from "./materialannualplan/table/table";
import ProductionMasterSchedulelFrom from "./productionMasterSchedule/Form/addEditForm";
import ProductionMasterSchedulelLanding from "./productionMasterSchedule/Table/index";
import PurchasePlanCreateForm from "./purchasePricePlan/form/addEditForm";
import PurchasePlanCreateFormView from "./purchasePricePlan/formView/addEditForm";
import PurchasePlanningForm from "./purchasePricePlan/productionPlanning/addEditForm";
import PurchasePlanTable from "./purchasePricePlan/table/table";
import SalesAndProductionPlanCreateForm from "./salesAndProductionPlan/form/addEditForm";
import SalesAndProductionPlanCreateFormView from "./salesAndProductionPlan/formView/addEditForm";
import ProductionPlanningForm from "./salesAndProductionPlan/productionPlanning/addEditForm";
import SalesAndProductionTable from "./salesAndProductionPlan/table/table";
import DetailsSalesPlanLanding from "./detailsSalesPlan/detailsSalesPlan";
import DetailsSalesPlanEntry from "./detailsSalesPlan/entryForm/addEditForm";
import DistributionPlanLanding from "./distributionPlan";
import ManufacturingOverheadPlanLanding from "./manufacturingOverheadPlan";

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

      {/* Purchase Plan */}
      <ContentRoute
        from="/production-management/salesAndOperationsPlanning/PurchasePlan/:plantId/:salesPlanId/createPP"
        component={PurchasePlanningForm}
      />
      <ContentRoute
        from="/production-management/salesAndOperationsPlanning/PurchasePlan/view/:viewId"
        component={PurchasePlanCreateFormView}
      />
      <ContentRoute
        from="/production-management/salesAndOperationsPlanning/PurchasePlan/edit/:id"
        component={PurchasePlanCreateForm}
      />
      <ContentRoute
        from="/production-management/salesAndOperationsPlanning/PurchasePlan/Create"
        component={PurchasePlanCreateForm}
      />

      <ContentRoute
        from="/production-management/salesAndOperationsPlanning/PurchasePlan"
        component={PurchasePlanTable}
      />
      <ContentRoute
        from="/production-management/salesAndOperationsPlanning/manufacturingoverheadplan"
        component={ManufacturingOverheadPlanLanding}
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
      {/* Distribuation Planning */}
      {/* <ContentRoute
        path="/production-management/salesAndOperationsPlanning/DistributionPlanning/edit"
        component={
          distributionPlanningPermission?.isCreate
            ? DistributionPlanEdit
            : NotPermitted
        }
      /> */}
      <ContentRoute
        path="/production-management/salesAndOperationsPlanning/DistributionPlanning/create"
        component={
          distributionPlanningPermission?.isCreate
            ? DistributionPlanCreateEdit
            : NotPermitted
        }
      />
      <ContentRoute
        path="/production-management/salesAndOperationsPlanning/DistributionPlanning"
        component={
          distributionPlanningPermission?.isView
            ? DistributionPlanLanding
            : NotPermitted
        }
      />

      {/* Details Sales Plan  */}
      <ContentRoute
        path="/production-management/salesAndOperationsPlanning/detailsalseplan/details/:actionType"
        component={DetailsSalesPlanEntry}
      />
      <ContentRoute
        path="/production-management/salesAndOperationsPlanning/detailsalseplan/details"
        component={DetailsSalesPlanLanding}
      />
      <ContentRoute
        path="/production-management/salesAndOperationsPlanning/detailsalseplan"
        component={MonthlySalesPlanLanding}
      />
    </Switch>
  );
}
