import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import { BudgetEntryLanding } from "./budgetEntry/Landing/addEditForm";
import { BudgetEntryCreate } from "./budgetEntry/Create/addEditForm";
import { BudgetEntryView } from "./budgetEntry/View/addEditForm";
import { BudgetEntryEdit } from "./budgetEntry/Edit/addEditForm";
import { HrPlanLanding } from "./HrPlan/landing";
import AssetLiabilityPlan from "./AssetLiabilityPlan";
import AssetLiabilityPlanCreateEdit from "./AssetLiabilityPlan/createEdit";
import ViewAssetLiabilityPlan from "./AssetLiabilityPlan/view";
import PurchasePlanningForm from "../../productionManagement/salesAndOperationPlanning/purchasePricePlan/productionPlanning/addEditForm";
import PurchasePlanCreateFormView from "../../productionManagement/salesAndOperationPlanning/purchasePricePlan/formView/addEditForm";
import PurchasePlanCreateForm from "../../productionManagement/salesAndOperationPlanning/purchasePricePlan/form/addEditForm";
import PurchasePlanTable from "../../productionManagement/salesAndOperationPlanning/purchasePricePlan/table/table";
import DistributionPlanCreateEdit from "../../productionManagement/salesAndOperationPlanning/distributionPlan/createEdit";
import NotPermitted from "../../performanceManagement/notPermittedPage/notPermitted";
import DistributionPlanLanding from "../../productionManagement/salesAndOperationPlanning/distributionPlan";
import DetailsSalesPlanEntry from "../../productionManagement/salesAndOperationPlanning/detailsSalesPlan/entryForm/addEditForm";
import DetailsSalesPlanLanding from "../../productionManagement/salesAndOperationPlanning/detailsSalesPlan/detailsSalesPlan";
import MonthlySalesPlanLanding from "../../productionManagement/salesAndOperationPlanning/detailsSalesPlan";
import ManufacturingOverheadPlanLanding from "../../productionManagement/salesAndOperationPlanning/manufacturingOverheadPlan";
import ProjectedFinancialStatement from "../ProjectedFinancialStatement";
import AssetLiabilityPlanEdit from "./AssetLiabilityPlan/Edit";
import ProductCostAnalysis from "./productCostAnalysis";
import CreateEditProductAnalysis from "./productCostAnalysis/CreateEditProductAnalysis";

export function InternalControlBudgetPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let budgetEntry = null;
  let hrPlan = null;
  let AssetLiabilityPlanPermission = null;
  let distributionPlanningPermission = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1156) {
      budgetEntry = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1340) {
      hrPlan = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1342) {
      AssetLiabilityPlanPermission = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1328) {
      distributionPlanningPermission = userRole[i];
    }
  }

  // 1340
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/internal-control/budget"
        to="/internal-control/budget/budgetentry"
      />
      <ContentRoute
        path="/internal-control/budget/budgetentry/view/:id"
        component={budgetEntry?.isView ? BudgetEntryView : NotPermittedPage}
      />
      <ContentRoute
        path="/internal-control/budget/budgetentry/edit/:id"
        component={budgetEntry?.isEdit ? BudgetEntryEdit : NotPermittedPage}
      />
      <ContentRoute
        path="/internal-control/budget/budgetentry/add"
        component={budgetEntry?.isCreate ? BudgetEntryCreate : NotPermittedPage}
      />
      <ContentRoute
        from="/internal-control/budget/budgetentry"
        component={budgetEntry?.isView ? BudgetEntryLanding : NotPermittedPage}
      />
      <ContentRoute
        from="/internal-control/budget/hrplan"
        component={hrPlan?.isView ? HrPlanLanding : NotPermittedPage}
      />
      <ContentRoute
        from="/internal-control/budget/ProjectedFinancialStatement"
        component={ProjectedFinancialStatement}
      />

      {/* Purchase Plan */}
      <ContentRoute
        from="/internal-control/budget/PurchasePlan/:plantId/:salesPlanId/createPP"
        component={PurchasePlanningForm}
      />
      <ContentRoute
        from="/internal-control/budget/PurchasePlan/view/:viewId"
        component={PurchasePlanCreateFormView}
      />
      <ContentRoute
        from="/internal-control/budget/PurchasePlan/edit/:id"
        component={PurchasePlanCreateForm}
      />
      <ContentRoute
        from="/internal-control/budget/PurchasePlan/Create"
        component={PurchasePlanCreateForm}
      />
      <ContentRoute
        from="/internal-control/budget/PurchasePlan"
        component={PurchasePlanTable}
      />

      {/* Distribuation Planning */}
      <ContentRoute
        path="/internal-control/budget/DistributionPlanning/create"
        component={
          distributionPlanningPermission?.isCreate
            ? DistributionPlanCreateEdit
            : NotPermitted
        }
      />
      <ContentRoute
        path="/internal-control/budget/DistributionPlanning"
        component={
          distributionPlanningPermission?.isView
            ? DistributionPlanLanding
            : NotPermitted
        }
      />

      {/* Details Sales Plan  */}
      <ContentRoute
        path="/internal-control/budget/detailsalseplan/details/:actionType"
        component={DetailsSalesPlanEntry}
      />
      <ContentRoute
        path="/internal-control/budget/detailsalseplan/details"
        component={DetailsSalesPlanLanding}
      />
      <ContentRoute
        path="/internal-control/budget/detailsalseplan"
        component={MonthlySalesPlanLanding}
      />

      {/* overhead */}

      <ContentRoute
        from="/internal-control/budget/manufacturingoverheadplan"
        component={ManufacturingOverheadPlanLanding}
      />

      {/* assets and liabilities */}

      <ContentRoute
        from="/internal-control/budget/AssetLiabilityPlan/view/:yearId/:buId"
        component={
          AssetLiabilityPlanPermission?.isView
            ? ViewAssetLiabilityPlan
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/internal-control/budget/AssetLiabilityPlan/edit/:yearId/:buId"
        component={
          AssetLiabilityPlanPermission?.isCreate
            ? AssetLiabilityPlanEdit
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/internal-control/budget/AssetLiabilityPlan/create"
        component={
          AssetLiabilityPlanPermission?.isCreate
            ? AssetLiabilityPlanCreateEdit
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/internal-control/budget/AssetLiabilityPlan"
        component={
          AssetLiabilityPlanPermission?.isView
            ? AssetLiabilityPlan
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/internal-control/budget/ProductCostAnalysis/create"
        component={CreateEditProductAnalysis}
      />
      <ContentRoute
        from="/internal-control/budget/ProductCostAnalysis"
        component={ProductCostAnalysis}
      />
    </Switch>
  );
}
