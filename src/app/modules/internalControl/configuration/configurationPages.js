import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { ContentRoute } from "../../../../_metronic/layout";
import { ProfitCenter } from "./profitCenter";
import ProfitCenterForm from "./profitCenter/Form/addEditForm";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import findIndex from '../../_helper/_findIndex'

export function InternalControlConfigurationPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const profitCenter = userRole[findIndex(userRole, "Profit Center")];

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/internal-control/configuration"
        to="/internal-control/configuration/profitcenter"
      />
      {/*  route for profit center  */}

      <ContentRoute
        path="/internal-control/configuration/profitcenter/edit/:id"
        component={profitCenter?.isEdit ? ProfitCenterForm : NotPermittedPage }
      />

      <ContentRoute
        path="/internal-control/configuration/profitcenter/add"
        component={profitCenter?.isCreate ? ProfitCenterForm : NotPermittedPage}
      />
      <ContentRoute
        from="/internal-control/configuration/profitcenter"
        component={ProfitCenter}
      />
    </Switch>
  );
}
