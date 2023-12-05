import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import DieselStatement from "./dieselReport/table";
import DieselStatementTwo from "./dieselReportTwo/table";
import LineExpenseReport from "./lineExpense/table";
import MonthlyVoyageStatement from "./monthlyVoyageStatement/table";
import StoreExpenseReport from "./storeExpense/table";
import LighterVesselReportsTable from "./table/table";
import DispatchAndDemurrage from "./dispatchDemurrage/table";
export function LighterVesselReportPages() {
  return (
    <>
      <LighterVesselReportsTable />
      <Switch>
        <Redirect
          exact={true}
          from="/chartering/lighterVessel"
          to="/chartering/lighterVessel/lighterVesselReport"
        />

        <Route
          path="/chartering/lighterVessel/lighterVesselReport/monthlyVoyageStatement"
          component={MonthlyVoyageStatement}
        />
        <Route
          path="/chartering/lighterVessel/lighterVesselReport/dieselStatement"
          component={DieselStatement}
        />
        <Route
          path="/chartering/lighterVessel/lighterVesselReport/dieselStatementTwo"
          component={DieselStatementTwo}
        />
        <Route
          path="/chartering/lighterVessel/lighterVesselReport/lineExpense"
          component={LineExpenseReport}
        />
        <Route
          path="/chartering/lighterVessel/lighterVesselReport/storeExpense"
          component={StoreExpenseReport}
        />
        <Route
          path="/chartering/lighterVessel/lighterVesselReport/lighterDispatchDemurrage"
          component={DispatchAndDemurrage}
        />
      </Switch>
    </>
  );
}
export default LighterVesselReportPages;
