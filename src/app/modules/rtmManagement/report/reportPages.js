import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import OutletSurveyReportLanding from "./outletSurveyReport/landing/index";

export function RTMReportPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/salesforceManagement"
        to="/rtm-management/salesforceManagement"
      />

      {/* Outlet Survey Report */}
      <ContentRoute
        path="/rtm-management/report/surveyReport"
        component={OutletSurveyReportLanding}
      />
    </Switch>
  );
}
export default RTMReportPages;
