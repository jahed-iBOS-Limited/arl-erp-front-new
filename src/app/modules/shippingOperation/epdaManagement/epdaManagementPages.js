import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import EDPALoadPort from "./loadPort";
import DischargePort from "./dischargePort";
import EDPADischargePort from "./dischargePort";


export function EpdaManagementPages() {
    return (
        <Switch>
            <Redirect
                exact={true}
                from='/shippingOperation'
                to='/shippingOperation/bunker-management/bunker'
            />
            <ContentRoute
                path='/shippingOperation/EPDA-management/load-port'
                component={EDPALoadPort}
            />
            <ContentRoute
                path='/shippingOperation/EPDA-management/discharge-port'
                component={EDPADischargePort}
            />

        </Switch>
    );
}
export default EpdaManagementPages;