import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { ContentRoute } from '../../../../_metronic/layout';
import ExpenseReport from './expenseReport';
import MasterBLLanding from './masterBl/landing';
import ProfitAndLoss from './profitAndLoss';
import CHAReport from './cha-report';
import CHABusinessReport from './cha-business-report';
import LiftingReport from './lifting-report';
import PIReport from './pl-report';

export function ReportPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/cargoManagement"
        to="/cargoManagement/report"
      />
      <ContentRoute
        path="/cargoManagement/report/expense-report"
        component={ExpenseReport}
      />
      <ContentRoute
        path="/cargoManagement/report/master-bl"
        component={MasterBLLanding}
      />
      <ContentRoute
        path="/cargoManagement/report/profit-and-loss"
        component={ProfitAndLoss}
      />
      <ContentRoute
        path="/cargoManagement/report/cha-report"
        component={CHAReport}
      />
      <ContentRoute
        path="/cargoManagement/report/lifting-report"
        component={LiftingReport}
      />
      <ContentRoute
        path="/cargoManagement/report/chabusiness-report"
        component={CHABusinessReport}
      />
      <ContentRoute
        path="/cargoManagement/report/pl-report"
        component={PIReport}
      />
    </Switch>
  );
}
export default ReportPages;
