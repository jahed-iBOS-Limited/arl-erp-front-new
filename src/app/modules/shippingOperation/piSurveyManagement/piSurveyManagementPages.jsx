import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";

export function PiSurveyManagementPages
    () {
    return (
        <Switch>
            <Redirect
                exact={true}
                from='/shippingOperation'
                to='/shippingOperation/P-and-I-survey-management'
            />
            <ContentRoute
                path='/shippingOperation/P-and-I-survey-management/P-and-I-survey'
                component={() => <h1>P-and-I-survey</h1>}
            />

        </Switch>
    );
}
export default PiSurveyManagementPages