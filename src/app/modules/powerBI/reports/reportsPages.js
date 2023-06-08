import React from "react";
import { Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import TestReport from "./testReport/landing/form";

export default function ReportsPages() {
  return (
    <Switch>
      <ContentRoute
        path="/powerbi/reports/test-reports"
        component={TestReport}
      />
    </Switch>
  );
}
