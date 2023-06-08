import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { ContentRoute } from "../../../../_metronic/layout";
import { CashJournal } from "../../financialManagement/financials/cashJournal/index";
import CashJournaEditForm from "../../financialManagement/financials/cashJournal/EditForm/addEditForm";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import CashJournaForm from "../../financialManagement/financials/cashJournal/Form/addEditForm";
import findIndex from "../../_helper/_findIndex";
import BankJournalEditForm from "../../financialManagement/financials/bankJournal/EditForm/addForm";
import BankJournalCreateForm from "../../financialManagement/financials/bankJournal/Create/addForm";
import BankJournalLanding from "../../financialManagement/financials/bankJournal/Table";
import AdjustmentJournalCreateForm from "../../financialManagement/financials/adjustmentJournal/Form/addEditForm";
import { AdjustmentJournal } from "../../financialManagement/financials/adjustmentJournal";
import ReconciliationJournal from "../../financialManagement/financials/reconciliationJournal/table/tableHeader";
import PaymentAdviceForm from "../../financialManagement/financials/paymentAdvice/form/addEditForm";
import BankAdvice from "../../financialManagement/financials/bankAdvce/table/BankAdvice";
import BankStatement from "../../financialManagement/financials/bankStatement/table/tableHeader";
import BankStateMentCorrectionLanding from "../../financialManagement/financials/BankStateMentCorrection/landing/tableHeader";
import ManualReconcileLanding from "../../financialManagement/financials/ManualReconcile/landing/tableHeader";
import { CustomerBankReceive } from "../../financialManagement/financials/customerBankReceive";
import SalesChallanRollBack from "../../financialManagement/financials/salesChallanRollBack/landing/form";

export function FinalcialPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const cashJournal = userRole[findIndex(userRole, "Cash Journal")];
  const bankJournal = userRole[findIndex(userRole, "Bank Journal")];
  const adjustmentJournal = userRole[findIndex(userRole, "Adjustment Journal")];

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/payment/financials"
        to="/payment/financials/cash"
      />
      <ContentRoute
        path="/payment/financials/cash/edit/:id"
        component={cashJournal?.isEdit ? CashJournaEditForm : NotPermittedPage}
      />
      <ContentRoute
        path="/payment/financials/cash/create"
        component={cashJournal?.isCreate ? CashJournaForm : NotPermittedPage}
      />
      <ContentRoute path="/payment/financials/cash" component={CashJournal} />
      <ContentRoute
        path="/payment/financials/bank/edit/:id"
        component={bankJournal?.isEdit ? BankJournalEditForm : NotPermittedPage}
      />
      <ContentRoute
        path="/payment/financials/bank/create"
        component={
          bankJournal?.isCreate ? BankJournalCreateForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/payment/financials/bank"
        component={BankJournalLanding}
      />
      <ContentRoute
        path="/payment/financials/adjustment/create"
        component={
          adjustmentJournal?.isCreate
            ? AdjustmentJournalCreateForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/payment/financials/adjustment/edit/:id"
        component={
          adjustmentJournal?.isEdit
            ? AdjustmentJournalCreateForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/payment/financials/adjustment"
        component={AdjustmentJournal}
      />
      <ContentRoute
        path="/payment/financials/reconciliation-journal"
        component={ReconciliationJournal}
      />
      <ContentRoute
        path="/payment/financials/paymentAdvice"
        component={PaymentAdviceForm}
      />
      <ContentRoute
        path="/payment/financials/bankadvice"
        component={BankAdvice}
      />
      <ContentRoute
        path="/payment/financials/bankStatementUpload"
        component={BankStatement}
      />
      <ContentRoute
        path="/payment/financials/bankStatementCorrection"
        component={BankStateMentCorrectionLanding}
      />
      <ContentRoute
        path="/payment/financials/manual-reconcile"
        component={ManualReconcileLanding}
      />
      <ContentRoute
        path="/payment/financials/customer-bank-receive"
        component={CustomerBankReceive}
      />

      <ContentRoute
        path="/payment/financials/saleschallanrollback"
        component={SalesChallanRollBack}
      />
    </Switch>
  );
}
