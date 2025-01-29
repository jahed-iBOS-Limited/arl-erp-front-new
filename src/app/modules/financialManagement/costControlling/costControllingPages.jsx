import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { ContentRoute } from "../../../../_metronic/layout";
import { ControllingUnit } from "./controllingUnit";
import CostControllingForm from "./controllingUnit/Form/addEditForm";
import { ProfitCenterGroup } from "./profitCenterGroup";
import { CostCenter } from "./costCenter";
import CostCenterForm from "./costCenter/Form/addEditForm";
import ProfitCenterGroupFrom from "./profitCenterGroup/Form/addEditForm";
import { CostCenterGroup } from "./costCenterGroup";
import { CostElement } from "./costElement";
import { CostCenterType } from "./costCenterType";
import CostCenterTypeForm from "./costCenterType/Form/addEditForm";
import CostElementForm from "./costElement/Form/addEditForm";
import CostCenterGroupForm from "./costCenterGroup/Form/addEditForm";
import { ProfitCenterTable } from "./profitCenter/Table/tableHeader";
import ProfitCenterForm from "./profitCenter/Form/addEditForm";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import WipSetupLanding from "./wipSetup/landing/table";
import findIndex from "../../_helper/_findIndex";

export function CostControllingPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const profitCenterGroup =
    userRole[findIndex(userRole, "Profit Center Group")];
  const controllingUnit = userRole[findIndex(userRole, "Controlling Unit")];
  const costCenterGroup = userRole[findIndex(userRole, "Cost Center Group")];
  const costCenterType = userRole[findIndex(userRole, "Cost Center Type")];
  const costCenter = userRole[findIndex(userRole, "Cost Center")];
  const costElement = userRole[findIndex(userRole, "Cost Element")];

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/financial-management/cost-controlling"
        to="/financial-management/cost-controlling/controlling-unit"
      />

      {/* Controlling Unit Routes */}
      <ContentRoute
        path="/financial-management/cost-controlling/controlling-unit/add"
        component={
          controllingUnit?.isCreate ? CostControllingForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/financial-management/cost-controlling/controlling-unit/edit/:id"
        component={
          controllingUnit?.isEdit ? CostControllingForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/financial-management/cost-controlling/controlling-unit"
        component={ControllingUnit}
      />

      {/* Profit Center Group Routes */}

      <ContentRoute
        path="/financial-management/cost-controlling/profit-center-group/add"
        component={
          profitCenterGroup?.isCreate ? ProfitCenterGroupFrom : NotPermittedPage
        }
      />

      <ContentRoute
        path="/financial-management/cost-controlling/profit-center-group/edit/:id"
        component={
          profitCenterGroup?.isEdit ? ProfitCenterGroupFrom : NotPermittedPage
        }
      />

      <ContentRoute
        path="/financial-management/cost-controlling/profit-center-group"
        component={ProfitCenterGroup}
      />

      {/* Cost Center Type */}
      <ContentRoute
        path="/financial-management/cost-controlling/costcenter-type/edit/:id"
        component={
          costCenterType?.isEdit ? CostCenterTypeForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/financial-management/cost-controlling/costcenter-type/add"
        component={
          costCenterType?.isCreate ? CostCenterTypeForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/financial-management/cost-controlling/costcenter-type"
        component={CostCenterType}
      />

      {/* Cost Element */}
      <ContentRoute
        path="/financial-management/cost-controlling/costelement/edit/:id"
        component={costElement?.isEdit ? CostElementForm : NotPermittedPage}
      />
      <ContentRoute
        path="/financial-management/cost-controlling/costelement/add"
        component={costElement?.isCreate ? CostElementForm : NotPermittedPage}
      />
      <ContentRoute
        path="/financial-management/cost-controlling/costelement"
        component={CostElement}
      />

      <ContentRoute
        path="/financial-management/cost-report/costsheet"
        component={NotPermittedPage}
      />

      {/* cost center route */}
      <ContentRoute
        exact={true}
        path="/financial-management/cost-controlling/cost_center"
        component={CostCenter}
      />
      <ContentRoute
        exact={true}
        path="/financial-management/cost-controlling/cost_center/add"
        component={costCenter?.isCreate ? CostCenterForm : NotPermittedPage}
      />
      <ContentRoute
        exact={true}
        path="/financial-management/cost-controlling/cost_center/edit/:id"
        component={costCenter?.isEdit ? CostCenterForm : NotPermittedPage}
      />

      {/* Cost Center Group Routes */}
      <ContentRoute
        exact={true}
        path="/financial-management/cost-controlling/costcenter-group/add"
        component={
          costCenterGroup?.isCreate ? CostCenterGroupForm : NotPermittedPage
        }
      />
      <ContentRoute
        exact={true}
        path="/financial-management/cost-controlling/costcenter-group/edit/:id"
        component={
          costCenterGroup?.isEdit ? CostCenterGroupForm : NotPermittedPage
        }
      />
      <ContentRoute
        exact={true}
        path="/financial-management/cost-controlling/costcenter-group"
        component={CostCenterGroup}
      />
      {/* Profit center */}

      <ContentRoute
        path="/financial-management/cost-controlling/profitcenter/edit/:id"
        component={ProfitCenterForm}
      />
      <ContentRoute
        path="/financial-management/cost-controlling/profitcenter/add"
        component={ProfitCenterForm}
      />

      <ContentRoute
        path="/financial-management/cost-controlling/profitcenter"
        component={ProfitCenterTable}
      />

      {/* Wip Setup */}
      <ContentRoute
        path="/financial-management/cost-controlling/wipsetup"
        component={WipSetupLanding}
      />
    </Switch>
  );
}
