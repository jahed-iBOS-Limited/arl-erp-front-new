import React from "react";
import { Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import GatePassApplicationLanding from "./gatePassApplication/index";
import CreateGatePassApplicationForm from "./gatePassApplication/Create/addForm"


export function GatePass() {
  return (
    <Switch>
      {/* <Redirect exact={true} from="/personal" to="/personal/approval" /> */}

      {/* Common Approval */}
      <ContentRoute
        from="/personal/gate-pass/gate-pass-application/create"
        component={CreateGatePassApplicationForm}
      />
      <ContentRoute
        from="/personal/gate-pass/gate-pass-application"
        component={GatePassApplicationLanding}
      />



    </Switch>
  );
}