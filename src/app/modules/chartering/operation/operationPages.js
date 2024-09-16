import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Recap from "./recap";
import RecapCreate from "./recap/create";
import EDPALoadPort from "./edpaLoadPort";
import DeadWeight from "./deadWeight";
import VesselNomination from "./vesselNomination";
import OnHireBunkerAndContionalSurvey from "./onHireBunkerAndContionalSurvey";
import DischargePort from "./dischargePort";

export function OperationPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/chartering/operation"
        to="/chartering/operation/dashboard"
      />

      {/* <Route
        path="/chartering/operation/recap/create"
        component={RecapCreate}
      /> */}
      <Route path="/chartering/operation/recap" component={Recap} />
      <Route
        path="/chartering/operation/epdaLoadPort"
        component={EDPALoadPort}
      />
      <Route path="/chartering/operation/piSurvey" component={DeadWeight} />
      <Route path="/chartering/operation/vesselNomination" component={VesselNomination} />
      <Route
        path="/chartering/operation/pre-stowagePlanning"
        component={DeadWeight}
      />
      <Route
        path="/chartering/operation/onHireBunkerAndContionalSurvey"
        component={OnHireBunkerAndContionalSurvey}
      />
      <Route
        path="/chartering/operation/dischargePortDepartureDocuments"
        component={DischargePort}
      />
    </Switch>
  );
}
export default OperationPages;
