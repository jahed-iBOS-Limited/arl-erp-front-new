import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import VesselNominationDashboard from "./vesselNominationDashboard";

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


        </Switch>
    );
}
export default VesselNominationPages;
