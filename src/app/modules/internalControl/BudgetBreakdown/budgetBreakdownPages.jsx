import React, { lazy, Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
const BreakdownEntry = lazy(() => import("./breakdownEntry"));


export function BudgetBreakdownPages() {
    return (
        <Suspense fallback={<LayoutSplashScreen />}>
            <Switch>
                <Redirect
                    exact={true}
                    from="/internal-control/BudgetBreakdown"
                    to="/internal-control/BudgetBreakdown/BreakdownEntry"
                />
                <ContentRoute
                    path="/internal-control/BudgetBreakdown/BreakdownEntry"
                    component={BreakdownEntry}
                />

            </Switch>
        </Suspense>
    );
}
