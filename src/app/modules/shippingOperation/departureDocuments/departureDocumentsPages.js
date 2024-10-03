import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import DischargePort from "./dischargePort";

export function DepartureDocumentsPages
    () {
    return (
        <Switch>
            <Redirect
                exact={true}
                from='/shippingOperation'
                to='/shippingOperation/departure-documents'
            />
            <ContentRoute
                path='/shippingOperation/departure-documents/load-port'
                component={() => <h1>Load Port</h1>}
            />
            <ContentRoute
                path='/shippingOperation/departure-documents/discharge-port'
                component={DischargePort}
            />

        </Switch>
    );
}
export default DepartureDocumentsPages
    ;
