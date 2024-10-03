import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import VesselNominationDashboard from "./vesselNominationDashboard";
import VesselNominationAccept from "./vesselNominationResponse";

export function VesselNominationPages() {
    return (
        <Switch>
            <Redirect
                exact={true}
                from='/shippingOperation'
                to='/shippingOperation/vessel-nomination'
            />
            <ContentRoute
                path='/shippingOperation/vessel-nomination/vessel-nomination-dashboard'
                component={VesselNominationDashboard}
            />
            <ContentRoute
                path='/shippingOperation/vessel-nomination/vessel-nomination-response'
                component={VesselNominationAccept}
            />


        </Switch>
    );
}
export default VesselNominationPages;
