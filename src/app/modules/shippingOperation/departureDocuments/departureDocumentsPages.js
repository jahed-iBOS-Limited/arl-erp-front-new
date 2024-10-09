import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import DischargePort from "./dischargePort";
import LoadPort from "./loadPort";

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
                component={LoadPort}
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
