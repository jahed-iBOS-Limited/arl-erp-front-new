import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { FinalcialPages } from "./financials/financialPages";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";
import { Suspense } from "react";
import { CostControllingPages } from "./costControlling/costControllingPages";
import { FinConfigurationPages } from "./configuration/configurationPages";
import { InvoiceManagementSystemPages } from "./invoiceManagementSystem/invoiceManagementSystemPages";
import { ExpensePages } from "./expense/expensePages";
import { ReportManagmentSystem } from "./report/report";
import {Banking} from "./banking/banking"
import {CostReportPages} from "./costReport/costReportPages"
import { RegisterReportPages } from './report/register/RegisterReportPages';
import ProjectAccountingPages from "./projectAccounting/projectAccountingPages";
export function financialManagementPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/financial-management"
          to="/financial-management/financials/sbu"
        />

        <ContentRoute
          path="/financial-management/financials"
          component={FinalcialPages}
        />
        <ContentRoute
          path="/financial-management/register"
          component={RegisterReportPages}
        />

        <ContentRoute
          path="/financial-management/cost-controlling"
          component={CostControllingPages}
        />
        <ContentRoute
          path="/financial-management/cost-report"
          component={CostReportPages}
        />

        <ContentRoute
          path="/financial-management/configuration"
          component={FinConfigurationPages}
        />
        <ContentRoute
          path="/financial-management/invoicemanagement-system"
          component={InvoiceManagementSystemPages}
        />
        <ContentRoute
          path="/financial-management/expense"
          component={ExpensePages}
        />

        <ContentRoute
          path="/financial-management/report"
          component={ReportManagmentSystem}
        />
        <ContentRoute
          path="/financial-management/banking"
          component={Banking}
        />
        <ContentRoute
          path="/financial-management/projectAccounting"
          component={ProjectAccountingPages}
        />
        
      </Switch>
    </Suspense>
  );
}

export default financialManagementPages;
