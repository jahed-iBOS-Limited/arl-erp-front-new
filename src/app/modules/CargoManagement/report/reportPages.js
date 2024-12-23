import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { ContentRoute } from '../../../../_metronic/layout';
import ExpenseReport from './expenseReport';
import MasterBLLanding from './masterBl/landing';

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
    </Switch>
  );
}
export default ReportPages;
