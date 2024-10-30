import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import BookingList from "./bookingList";
import ExpenseReport from "./expenseReport";

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
            <ContentRoute
                path='/cargoManagement/operation/expense-report'
                component={ExpenseReport}

            />

        </Switch>
    );
}
export default OperationPages;
