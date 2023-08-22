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

export function InternalControlBudgetPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let budgetEntry = null;
  let hrPlan = null;
  let AssetLiabilityPlanPermission = null;
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
        from="/internal-control/budget/AssetLiabilityPlan/create"
        component={
          !AssetLiabilityPlanPermission?.isCreate
            ? AssetLiabilityPlanCreateEdit
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/internal-control/budget/AssetLiabilityPlan"
        component={
          !AssetLiabilityPlanPermission?.isView
            ? AssetLiabilityPlan
            : NotPermittedPage
        }
      />
    </Switch>
  );
}
