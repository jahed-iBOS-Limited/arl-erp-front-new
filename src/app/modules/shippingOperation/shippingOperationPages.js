import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import RecapManagementPages from "./recapManagement/recapManagementPages";
import VesselNominationPages from "./vesselNomination/vesselNominationPages";
import BunkerManagementPages from "./bunkerManagement/bunkerManagementPages";
import EpdaManagementPages from "./epdaManagement/epdaManagementPages";
import DeadWeightPreStowagePlanningPages from "./deadWeightPreStowagePlanning/deadWeightPreStowagePlanningPages";
import HireBunkerAndContionalSurveyPages from "./hireBunkerAndContionalSurvey/hireBunkerAndContionalSurveyPages";
import PiSurveyManagementPages from "./piSurveyManagement/piSurveyManagementPages";
import DepartureDocumentsPages from "./departureDocuments/departureDocumentsPages";

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
                <ContentRoute
                    path='/shippingOperation/EPDA-management'
                    component={EpdaManagementPages}
                />
                <ContentRoute
                    path='/shippingOperation/deadweight-and-pre-stowage-planning'
                    component={DeadWeightPreStowagePlanningPages}
                />
                <ContentRoute
                    path='/shippingOperation/hire-bunker-and-condition-survey'
                    component={HireBunkerAndContionalSurveyPages}
                />
                <ContentRoute
                    path='/shippingOperation/P-and-I-survey-management'
                    component={PiSurveyManagementPages}
                />
                 <ContentRoute
                    path='/shippingOperation/departure-documents'
                    component={DepartureDocumentsPages}
                />
            </Switch>
        </Suspense>
    );
}
export default ShippingOperaionPages;
