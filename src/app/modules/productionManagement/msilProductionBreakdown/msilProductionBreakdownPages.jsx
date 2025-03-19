import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import ProductionBreakdown from "./productionBreakdown";
import ProductionBreakdownCreate from "./productionBreakdown/Form/addEditForm";

export function MsilProductionBreakdownPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let breakDownEntry = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1095) {
      breakDownEntry = userRole[i];
    }
  }

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/production-management"
        to="/production-management/msil-Rolling"
      />
      <ContentRoute
        path="/production-management/msil-ProductionBreakdown/ProductionBreakdown/edit/:id"
        component={
          breakDownEntry?.isEdit ? ProductionBreakdownCreate : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-ProductionBreakdown/ProductionBreakdown/create"
        component={
          breakDownEntry?.isCreate
            ? ProductionBreakdownCreate
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-ProductionBreakdown/ProductionBreakdown"
        component={
          breakDownEntry?.isView ? ProductionBreakdown : NotPermittedPage
        }
      />
    </Switch>
  );
}
