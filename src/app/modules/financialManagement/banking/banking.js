import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import FundPositionReport from "../report/fundPositionReport/landing";
import PlanActCashFlow from "../report/planActCashFlow";
import ProjectedCashFlowLanding from "../report/projectedCashFlow";
import ProjectedCashFlowCreateEdit from "../report/projectedCashFlow/createEdit";
import ChequeRegister from "./chequeRegister/index";
import FdrCreate from "./fundManagement/fdrRegister/create/FdrCreate";
import FdrRegisterLanding from "./fundManagement/fdrRegister/landing/FdrRegisterLanding";
import FdrView from "./fundManagement/fdrRegister/view/FdrView";
import FundLimitCreate from "./fundManagement/fundLimit/create/FundLimitCreate";
import FundLimitLanding from "./fundManagement/fundLimit/landing/FundLimitLanding";
import LoanRegisterCreate from "./fundManagement/loanRegister/create/LoanRegisterCreate";
import LoanRegisterLanding from "./fundManagement/loanRegister/landing/LoanRegisterLanding";
import RepayCreate from "./fundManagement/loanRegister/repay/Repay";
import LoanRegisterView from "./fundManagement/loanRegister/view/loanRegisterView";

export function Banking() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/financial-management/banking"
        to="/financial-management/banking/trailbalance"
      />

      <ContentRoute
        path="/financial-management/banking/cheque-register"
        component={ChequeRegister}
      />

      {/* fund limit */}
      <ContentRoute
        path="/financial-management/banking/fund-limit/edit/:id"
        component={FundLimitCreate}
      />
      <ContentRoute
        path="/financial-management/banking/fund-limit/create"
        component={FundLimitCreate}
      />
      <ContentRoute
        path="/financial-management/banking/fund-limit"
        component={FundLimitLanding}
      />

      {/* loan register */}
      {/* <ContentRoute
        path="/financial-management/banking/loan-register/edit/:id"
        component={LoanRegisterCreate}
      /> */}
      <ContentRoute
        path="/financial-management/banking/loan-register/repay/:id"
        component={RepayCreate}
      />
      <ContentRoute
        path="/financial-management/banking/loan-register/view/:id"
        component={LoanRegisterView}
      />
      <ContentRoute
        path="/financial-management/banking/loan-register/re-new/:renewId"
        component={LoanRegisterCreate}
      />
      <ContentRoute
        path="/financial-management/banking/loan-register/create"
        component={LoanRegisterCreate}
      />
      <ContentRoute
        path="/financial-management/banking/loan-register"
        component={LoanRegisterLanding}
      />

      {/* fdr register */}
      <ContentRoute
        path="/financial-management/banking/fdr-register/view/:id"
        component={FdrView}
      />
      <ContentRoute
        path="/financial-management/banking/fdr-register/renew/:id"
        component={FdrCreate}
      />
      <ContentRoute
        path="/financial-management/banking/fdr-register/create"
        component={FdrCreate}
      />
      <ContentRoute
        path="/financial-management/banking/fdr-register"
        component={FdrRegisterLanding}
      />

      {/* report */}

      <ContentRoute
        path="/financial-management/banking/FundPositionReport"
        component={FundPositionReport}
      />
      <ContentRoute
        path="/financial-management/banking/ProjectedCashflow/create"
        component={ProjectedCashFlowCreateEdit}
      />
      <ContentRoute
        path="/financial-management/banking/ProjectedCashflow"
        component={ProjectedCashFlowLanding}
      />
       <ContentRoute
        path="/financial-management/banking/PlanVsActCashflow"
        component={PlanActCashFlow}
      />
    </Switch>
  );
}
