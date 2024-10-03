import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import OnHireBunkerAndContionalSurvey from "./onHireBunkerACS";

export function HireBunkerAndContionalSurveyPages() {
    return (
        <Switch>
            <Redirect
                exact={true}
                from='/shippingOperation'
                to='/shippingOperation/hire-bunker-and-condition-survey'
            />
            <ContentRoute
                path='/shippingOperation/hire-bunker-and-condition-survey/onHire-bunker-and-conditional-survey'
                component={OnHireBunkerAndContionalSurvey}
            />
            <ContentRoute
                path='/shippingOperation/hire-bunker-and-condition-survey/offHire-bunker-and-conditional-survey'
                component={() => <h1>Off Hire Bunker</h1>}
            />

        </Switch>
    );
}
export default HireBunkerAndContionalSurveyPages;
