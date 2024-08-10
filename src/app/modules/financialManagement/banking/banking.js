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
import BankGuaranteeLanding from "../report/bankGuarantee/landing";
import BankGuaranteeEntry from "../report/bankGuarantee/entryForm";
import FundRegisterLanding from "../report/fundRegister";
import InventoryBalanceTreasury from "../report/InventoryBalanceTreasury";
import CashMarginLanding from "./cashMargin";
import CreateCashMargin from "./cashMargin/createCashMargin";
import ViewEditCashMargin from "./cashMargin/editViewCashMargin";
import ReceivableTreasuryReport from "./receivableTreasury/table";
import PayableReport from "../report/payableReport";
import BankAdvice from "./bankAdvce/table/BankAdvice";
import NonBankingFund from "./nonBankingFund";
import NonBankingFundCreateEdit from "./nonBankingFund/createEdit";
import Repay from "./nonBankingFund/repay";
import BankLetter from "../report/bankLetter";
import BankStock from "../report/bankStock";
import InterCompanyLoan from "./InterCompanyLoan";
import InterCompanyLoanCreate from "./InterCompanyLoan/createEdit";
import RepayViewModal from "./InterCompanyLoan/repayView";

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
      <ContentRoute
        path="/financial-management/banking/loan-register/edit/:editId"
        component={LoanRegisterCreate}
      />
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
      <ContentRoute
        path="/financial-management/banking/BankGuarantee/:entryType/:typeId"
        component={BankGuaranteeEntry}
      />
      <ContentRoute
        path="/financial-management/banking/BankGuarantee"
        component={BankGuaranteeLanding}
      />

      <ContentRoute
        path="/financial-management/banking/BankLetter"
        component={BankLetter}
      />
      <ContentRoute
        path="/financial-management/banking/BankStock"
        component={BankStock}
      />


      <ContentRoute
        path={`/financial-management/banking/CashMargin/:actionType/:id`}
        component={ViewEditCashMargin}
      />
      <ContentRoute
        path="/financial-management/banking/CashMargin/:actionType"
        component={CreateCashMargin}
      />
      <ContentRoute
        path="/financial-management/banking/CashMargin"
        component={CashMarginLanding}
      />
      <ContentRoute
        path="/financial-management/banking/FundRegister"
        component={FundRegisterLanding}
      />
      <ContentRoute
        path="/financial-management/banking/InventoryBalanceTreasury"
        component={InventoryBalanceTreasury}
      />
      <ContentRoute
        path="/financial-management/banking/receivabletreasury"
        component={ReceivableTreasuryReport}
      />
      <ContentRoute
        path="/financial-management/banking/payabletreasury"
        component={PayableReport}
      />
      <ContentRoute
        path="/financial-management/banking/BankAdviceForBanking"
        component={BankAdvice}
      />
      <ContentRoute
        path="/financial-management/banking/NonBankingFund/repay/:id"
        component={Repay}
      />
      <ContentRoute
        path="/financial-management/banking/NonBankingFund/create"
        component={NonBankingFundCreateEdit}
      />
      <ContentRoute
        path="/financial-management/banking/NonBankingFund"
        component={NonBankingFund}
      />
      <ContentRoute
        path="/financial-management/banking/InterCompanyLoan/view"
        component={RepayViewModal}
      />
      <ContentRoute
        path="/financial-management/banking/InterCompanyLoan/create"
        component={InterCompanyLoanCreate}
      />
       <ContentRoute
        path="/financial-management/banking/InterCompanyLoan"
        component={InterCompanyLoan}
      />
    </Switch>
  );
}
