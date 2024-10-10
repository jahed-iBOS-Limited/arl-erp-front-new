import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import BookingList from "./bookingList";

export function OperationPages() {
    return (
        <Switch>
            <Redirect
                exact={true}
                from='/cargoManagement'
                to='/cargoManagement/operation'
            />
             <ContentRoute
                path='/cargoManagement/operation/bookingList'
                component={BookingList}
            />

        </Switch>
    );
}
export default OperationPages;
