import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import RecapManagementPages from "./recapManagement/recapManagementPages";
import VesselNominationPages from "./vesselNomination/vesselNominationPages";
import BunkerManagementPages from "./bunkerManagement/bunkerManagementPages";

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
                <ContentRoute
                    path='/shippingOperation/vessel-nomination'
                    component={VesselNominationPages}
                />
                 <ContentRoute
                    path='/shippingOperation/bunker-management'
                    component={BunkerManagementPages}
                />
            </Switch>
        </Suspense>
    );
}
export default ShippingOperaionPages;
