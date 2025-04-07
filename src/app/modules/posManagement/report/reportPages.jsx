import React, { Suspense } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { ContentRoute, LayoutSplashScreen } from '../../../../_metronic/layout';
import SalesReport from './salesReport/SalesReport';
import { shallowEqual, useSelector } from 'react-redux';
import NotPermitted from '../../performanceManagement/notPermittedPage/notPermitted';
import CashBookReport from './cashBook/cashBook';
import DamageReport from './damageReport/DamageReport';
import EmployeeSubledgerReport from './employeeSubledger/employeeSubledger';
import MonthlySalesReport from './monthlySalesInfo/monthlySalesReport';
import OutletWiseDueReport from './outletWiseDueReport/outletWiseDueReport';
import POSSalaryDeduct from './POSSalaryDeduct';
import ProfitAndLossReport from './profitAndLossReport';
import SalesProfit from './salesProfit/SalesProfit';
import { SalesStatementTable } from './salesStatementReport/Table/tableHeader';

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
          component={
            POSSalaryDeductUser?.isView ? POSSalaryDeduct : NotPermitted
          }
        />
        <ContentRoute
          exact
          path="/pos-management/report/ProfitAndLossReport"
          component={ProfitAndLossReport}
        />
      </Switch>
    </Suspense>
  );
}

export default ReportPages;
