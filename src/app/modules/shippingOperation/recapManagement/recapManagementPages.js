import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import CaptureRecap from "./captureRecap";
import CaptureRecapCreate from "./captureRecap/create";

export function RecapManagementPages() {
    return (
        <Switch>
            <Redirect
                exact={true}
                from='/shippingOperation'
                to='/shippingOperation/recap-management'
            />
             <ContentRoute
                path='/shippingOperation/recap-management/capture-recap/create'
                component={CaptureRecapCreate}
            />
            <ContentRoute
                path='/shippingOperation/recap-management/capture-recap'
                component={CaptureRecap}
            />

        </Switch>
    );
}
export default RecapManagementPages;
