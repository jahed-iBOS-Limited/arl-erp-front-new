import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import { BudgetEntryLanding } from "./budgetEntry/Landing/addEditForm";
import { BudgetEntryCreate } from "./budgetEntry/Create/addEditForm";
import { BudgetEntryView } from "./budgetEntry/View/addEditForm";
import { BudgetEntryEdit } from "./budgetEntry/Edit/addEditForm";

export function InternalControlBudgetPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let budgetEntry = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1156) {
      budgetEntry = userRole[i];
    }
  }
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
    </Switch>
  );
}
