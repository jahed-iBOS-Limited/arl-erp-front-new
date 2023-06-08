import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import BilletConsumption from "./billetConsumption";
import BilletConsumptionCreate from "./billetConsumption/Form/addEditForm";
import FinishProduction from "./finishProduction";
import FinishProductionCreate from "./finishProduction/Form/addEditFrom";
import QualityReport from "./qualityReport";
import QualityControlCreate from "./qualityReport/Form/addEditForm";
import WastageProduction from "./wastageProductionHour";
import WastageProductionCreate from "./wastageProductionHour/Form/addEditFrom";

export function MsilRollingDepartmentPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let wastageProductionHour = null;
  let finishProduction = null;
  let billetConsumption = null;
  let qualityReportPermission = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1077) {
      wastageProductionHour = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1079) {
      finishProduction = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1078) {
      billetConsumption = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1096) {
      qualityReportPermission = userRole[i];
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
        path="/production-management/msil-Rolling/WastageProductionHour/edit/:id"
        component={
          wastageProductionHour?.isEdit
            ? WastageProductionCreate
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Rolling/WastageProductionHour/create"
        component={
          wastageProductionHour?.isCreate
            ? WastageProductionCreate
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Rolling/WastageProductionHour"
        component={
          wastageProductionHour?.isView ? WastageProduction : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Rolling/FinishProduction/edit/:id"
        component={
          finishProduction?.isEdit ? FinishProductionCreate : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Rolling/FinishProduction/create"
        component={
          finishProduction?.isCreate ? FinishProductionCreate : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Rolling/FinishProduction"
        component={
          finishProduction?.isView ? FinishProduction : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Rolling/BilletConsumption/create"
        component={
          billetConsumption?.isCreate
            ? BilletConsumptionCreate
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Rolling/BilletConsumption/edit/:id"
        component={
          billetConsumption?.isEdit ? BilletConsumptionCreate : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Rolling/BilletConsumption"
        component={
          billetConsumption?.isView ? BilletConsumption : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Rolling/QualityReport/edit/:id"
        component={
          qualityReportPermission?.isEdit
            ? QualityControlCreate
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Rolling/QualityReport/create"
        component={
          qualityReportPermission?.isCreate
            ? QualityControlCreate
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Rolling/QualityReport"
        component={
          qualityReportPermission?.isView ? QualityReport : NotPermittedPage
        }
      />
    </Switch>
  );
}
