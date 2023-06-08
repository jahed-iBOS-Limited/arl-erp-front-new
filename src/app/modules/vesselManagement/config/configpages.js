import React from "react";
import { Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import MotherVesselLanding from "./motherVessel/landing/landing";
import LighterVesselLanding from "./lighterVessel/landing/_landing";
import GodownLanding from "./goDown/_landing/_landing";
import StevedoreLanding from "./stevedore/landing/landing";
import CNFLanding from "./cnf/landing/landing";
import LighterDestination from "./lighterDestination/landing/landing";
import DirectAndDumpRateLanding from "./directAndDumpRate";

export default function ConfigPages() {
  return (
    <Switch>
      <ContentRoute
        path="/vessel-management/configuration/mothervessel"
        component={MotherVesselLanding}
      />
      <ContentRoute
        path="/vessel-management/configuration/lightervessel"
        component={LighterVesselLanding}
      />
      <ContentRoute
        path="/vessel-management/configuration/godown"
        component={GodownLanding}
      />
       <ContentRoute
        path="/vessel-management/configuration/directndumprate"
        component={DirectAndDumpRateLanding}
      />
      <ContentRoute
        path="/vessel-management/configuration/lighterstevedore"
        component={StevedoreLanding}
      />
      <ContentRoute
        path="/vessel-management/configuration/lighterdestination"
        component={LighterDestination}
      />
      <ContentRoute
        path="/vessel-management/configuration/lightercnf"
        component={CNFLanding}
      />
    </Switch>
  );
}
