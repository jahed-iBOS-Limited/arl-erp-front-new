import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import GatePassApplicationLanding from "./gatePassApplication/index";
import CreateGatePassApplicationForm from "./gatePassApplication/Create/addForm";
// import commonForm from "./gatePassApplication/Create/commonForm";
// import ViewReport from "./gatePassApplication/View/viewReport";

export function GatePass() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from='/inventory-management'
        to='/inventory-management/approval'
      />
      <ContentRoute
        path='/inventory-management/gate-pass/gate-pass-application/edit/:pId'
        component={CreateGatePassApplicationForm}
      />
      {/* <ContentRoute
        path='/inventory-management/gate-pass/gate-pass-application/view/:pId'
        component={ViewReport}
      /> */}
      <ContentRoute
        path='/inventory-management/gate-pass/gate-pass-application/create'
        component={CreateGatePassApplicationForm}
      />

      <ContentRoute
        path='/inventory-management/gate-pass/gate-pass-application'
        component={GatePassApplicationLanding}
      />
    </Switch>
  );
}
