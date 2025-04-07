import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { ContentRoute } from '../../../../_metronic/layout';
import ExpenceReport from './expenseReport';

export function ReportPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/human-capital-management"
        to="/human-capital-management/report"
      />
      {/*  Expense Report*/}
      <ContentRoute
        path="/human-capital-management/Report/expenseReport"
        component={ExpenceReport}
      />
    </Switch>
  );
}
