import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import RecapManagementPages from "./recapManagement/recapManagementPages";

export function ShippingOperaionPages() {
    return (
        <Suspense fallback={<LayoutSplashScreen />}>
            <Switch>
                <Redirect
                    exact={true}
                    from='/shippingOperation'
                    to='/shippingOperation/recap-management'
                />
                <ContentRoute
                    path='/shippingOperation/recap-management'
                    component={RecapManagementPages}
                />
            </Switch>
        </Suspense>
    );
}
export default ShippingOperaionPages;
