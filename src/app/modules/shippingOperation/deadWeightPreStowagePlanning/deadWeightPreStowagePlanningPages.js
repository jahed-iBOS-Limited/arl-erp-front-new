import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import DeadWeightAndPreStowagePlaning from "./deadWeightPreStowagePlanningChild";

export function DeadWeightPreStowagePlanningPages
    () {
    return (
        <Switch>
            <Redirect
                exact={true}
                from='/shippingOperation'
                to='/shippingOperation/deadweight-and-pre-stowage-planning'
            />
            <ContentRoute
                path='/shippingOperation/deadweight-and-pre-stowage-planning/deadweight-and-pre-stowage-planning'
                component={DeadWeightAndPreStowagePlaning}
            />

        </Switch>
    );
}
export default DeadWeightPreStowagePlanningPages
    ;
