import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../../_metronic/layout";
import SubSchedule from "./registerReports/SubSchedule";
import NotPermittedPage from './../../../_helper/notPermitted/NotPermittedPage';
import CashAtBank from './registerReports/CashAtBank';
import Customer from './registerReports/Customer';
import InvestmentPartner from "./registerReports/InvestmentPartner";
import Employee from './registerReports/Employee';
import Supplier from './registerReports/Supplier';
import BankStateMentSummary from "./registerReports/BankStatementSummary";

export function RegisterReportPages() {

  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let subSch = null;
  let cashAtBank = null;
  let supplier = null;
  let customer = null;
  let employee = null;
  let investmentPartner = null;
  let bankStatementSummaryPermission = null;


  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1052) {
      subSch = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1053) {
      cashAtBank = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1054) {
      customer = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1055) {
      supplier = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1056) {
      employee = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1057) {
      investmentPartner = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1288) {
      bankStatementSummaryPermission = userRole[i];
    }
  }
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/financial-management/register"
        to="/financial-management/register/sub-schedule"
      />
      <ContentRoute
        from="/financial-management/register/sub-schedule"
        component={subSch?.isView ? SubSchedule : NotPermittedPage}
      />
      <ContentRoute
        from="/financial-management/register/cash-at-bank"
        component={cashAtBank?.isView ? CashAtBank : NotPermittedPage}
      />
      <ContentRoute
        from="/financial-management/register/customer"
        component={customer?.isView ? Customer : NotPermittedPage}
      />
      <ContentRoute
        from="/financial-management/register/supplier"
        component={supplier?.isView ? Supplier : NotPermittedPage}
      />
      <ContentRoute
        from="/financial-management/register/employee"
        component={employee?.isView ? Employee : NotPermittedPage}
      />
      <ContentRoute
        from="/financial-management/register/investment-partner"
        component={investmentPartner?.isView ? InvestmentPartner : NotPermittedPage}
      />
      <ContentRoute
        from="/financial-management/register/bank-statement-summary"
        component={bankStatementSummaryPermission?.isView ? BankStateMentSummary : NotPermittedPage}
      />
    </Switch>
  );
}
