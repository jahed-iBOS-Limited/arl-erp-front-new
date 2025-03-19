import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import PerformanceDialogReport from "./performanceDialogReport/landing/table";


export function ReportPages() {
  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let performanceDialogReport = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1204) {
      performanceDialogReport = userRole[i];
    }
  }

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/MgmtOfPerformance/Report"
        to="/MgmtOfPerformance/Report"
      />
      

      {/* Performance dialog report */}
      
      <ContentRoute
        from="/MgmtOfPerformance/Report/PerformanceDialogReport"
        component={performanceDialogReport?.isView ? PerformanceDialogReport : NotPermittedPage}
      />      
    </Switch>
  );
}
