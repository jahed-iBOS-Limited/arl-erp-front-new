import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { Suspense } from "react";
import SalesReport from "./salesReport/SalesReport"
import SalesDetails from "./salesDetails/SalesDetails"
import { SalesStatementTable } from "./salesStatementReport/Table/tableHeader"
import DamageReport from "./damageReport/DamageReport"
import DateWiseDeliveryReport from "./dateWiseDelivery/DateWiseDeliveryReport"
import MonthlySalesReport from './monthlySalesInfo/monthlySalesReport'
import SalesProfit from "./salesProfit/SalesProfit"
import OutletWiseDueReport from "./outletWiseDueReport/outletWiseDueReport"
import EmployeeSubledgerReport from "./employeeSubledger/employeeSubledger"
import CashBookReport from "./cashBook/cashBook"
import POSSalaryDeduct from "./POSSalaryDeduct";
import { shallowEqual, useSelector } from "react-redux";
import NotPermitted from "../../performanceManagement/notPermittedPage/notPermitted";

export function ReportPages() {

  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let POSSalaryDeductUser = null;
  
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1260) {
      POSSalaryDeductUser = userRole[i];
    }
  }


  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact
          from="/pos-management"
          to="/pos-management/report/sales-report"
        />
        <ContentRoute
          exact
          path="/pos-management/report/sales-report"
          component={SalesReport}
        />
        <ContentRoute
          exact
          path="/pos-management/report/sales-details"
          component={SalesDetails}
        />
        <ContentRoute
          exact
          path="/pos-management/report/sales-statement"
          component={SalesStatementTable}
        />
        <ContentRoute
          exact
          path="/pos-management/report/damage-report"
          component={DamageReport}
        />
        <ContentRoute
          exact
          path="/pos-management/report/dateWiseDelivey"
          component={DateWiseDeliveryReport}
        />

        <ContentRoute
          exact
          path="/pos-management/report/monthly-sales-info"
          component={MonthlySalesReport}
        />

        <ContentRoute
          exact
          path="/pos-management/report/grossprofit"
          component={SalesProfit}
        />
        <ContentRoute
          exact
          path="/pos-management/report/outletWiseDueReport"
          component={OutletWiseDueReport}
        />
        <ContentRoute
          exact
          path="/pos-management/report/employeeSubLedger"
          component={EmployeeSubledgerReport}
        />
        <ContentRoute
          exact
          path="/pos-management/report/cashBook"
          component={CashBookReport}
        />
        <ContentRoute
          exact
          path="/pos-management/report/POSSalaryDeduct"
          component={POSSalaryDeductUser?.isView ? POSSalaryDeduct : NotPermitted}
        />
      </Switch>
    </Suspense>
  );
}

export default ReportPages;
