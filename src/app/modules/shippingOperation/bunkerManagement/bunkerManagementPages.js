import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import BunkerCalculatorLanding from "../../chartering/operation/bunkerManagement";
import BunkerManagementCreate from "./bunker/create";

export function BunkerManagementPages() {
    return (
        <Switch>
            <Redirect
                exact={true}
                from='/shippingOperation'
                to='/shippingOperation/bunker-management/bunker'
            />
            <ContentRoute
                path='/shippingOperation/bunker-management/bunker/create'
                component={BunkerManagementCreate}
            />
            <ContentRoute
                path='/shippingOperation/bunker-management/bunker'
                component={BunkerCalculatorLanding}
            />

        </Switch>
    );
}
export default BunkerManagementPages;