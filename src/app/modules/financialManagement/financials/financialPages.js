import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import { AdjustmentJournal } from "./adjustmentJournal";
import AdjustmentJournalCreateForm from "./adjustmentJournal/Form/addEditForm";
import { CashJournal } from "./cashJournal";
import CashJournaForm from "./cashJournal/Form/addEditForm";

import BankJournalCreateForm from "./bankJournal/Create/addForm";
import BankJournalEditForm from "./bankJournal/EditForm/addForm";
import BankJournalLanding from "./bankJournal/Table/index";
import CashJournaEditForm from "./cashJournal/EditForm/addEditForm";

import findIndex from "../../_helper/_findIndex";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import BankStateMentCorrectionLanding from "./BankStateMentCorrection/landing/tableHeader";
import BusinessUnitForm from "./BusinessUnitTransaction/Form/addEditForm";
import { BusinessUnitTransaction } from "./BusinessUnitTransaction/index";
import ManualReconcileLanding from "./ManualReconcile/landing/tableHeader";
import TdsVdsJvLanding from "./TDS_VDS_JV_create/landing";
import AccountClosingCreateForm from "./accountingClosing/Form/addEditForm";
import BankAdvice from "./bankAdvce/table/BankAdvice";
import CreateBankLimit from "./bankLimit/form";
import BankLimit from "./bankLimit/table/tableRow";
import BankStatement from "./bankStatement/table/tableHeader";
import { BudgetEntryCreate } from "./budgetEntry/Create/addEditForm";
import { BudgetEntryLanding } from "./budgetEntry/Landing/addEditForm";
import BulkBankReceive from "./bulkBankReceive/Form/addEditForm";
import BulkJVLanding from "./bulkJV/table/tableHeader";
import { CustomerBankReceive } from "./customerBankReceive";
import IncentiveBillPaymentLanding from "./incentiveBillPayment";
import PaymentAdviceForm from "./paymentAdvice/form/addEditForm";
import ProductionCost from "./productionCosting";
import ReconciliationJournal from "./reconciliationJournal/table/tableHeader";
import TransferJournalToTax from "./transferJournalToTax";
import BankJournalCreateFormCollection from "./bankJournal/collectionCreate/addForm";
import CashJournaFormForCollection from "./cashJournal/collectionCreate/addEditForm";
// import DepreciationJournal from "./depreciationJournal/table/tableHeader"

export function FinalcialPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const cashJournal = userRole[findIndex(userRole, "Cash Journal")];
  const bankJournal = userRole[findIndex(userRole, "Bank Journal")];
  const adjustmentJournal = userRole[findIndex(userRole, "Adjustment Journal")];
  const busisnessTransaction =
    userRole[findIndex(userRole, "Business Transaction")];

  const productionCostPermission =
    userRole[findIndex(userRole, "Production Costing")];

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/financial-management/financials"
        to="/financial-management/financials/sbu"
      />

      {/* Bank Journal */}
      {/* Edit and Create form is same */}
      <ContentRoute
        path="/financial-management/financials/bank/edit/:id"
        component={bankJournal?.isEdit ? BankJournalEditForm : NotPermittedPage}
      />
       <ContentRoute
        path="/financial-management/financials/bank/collection"
        component={
          bankJournal?.isCreate ? BankJournalCreateFormCollection : NotPermittedPage
        }
      />
      <ContentRoute
        path="/financial-management/financials/bank/create"
        component={
          bankJournal?.isCreate ? BankJournalCreateForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/financial-management/financials/bank"
        component={BankJournalLanding}
      />

      {/* Adjustable Journal */}
      {/* <ContentRoute
        path="/financial-management/financials/adjustment/view/:id"
        component={
          adjustmentJournal?.isView
            ? 
            AdjustmentJournalView
            : NotPermittedPage
        }
      /> */}
      <ContentRoute
        path="/financial-management/financials/adjustment/create"
        component={
          adjustmentJournal?.isCreate
            ? AdjustmentJournalCreateForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/financial-management/financials/adjustment/edit/:id"
        component={
          adjustmentJournal?.isEdit
            ? AdjustmentJournalCreateForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/financial-management/financials/adjustment"
        component={AdjustmentJournal}
      />
      {/* Cash Journal Route  */}
      <ContentRoute
        path="/financial-management/financials/cash/edit/:id"
        component={cashJournal?.isEdit ? CashJournaEditForm : NotPermittedPage}
      />
      <ContentRoute
        path="/financial-management/financials/cash/collection"
        component={cashJournal?.isCreate ? CashJournaFormForCollection : NotPermittedPage}
      />
      <ContentRoute
        path="/financial-management/financials/cash/create"
        component={cashJournal?.isCreate ? CashJournaForm : NotPermittedPage}
      />
      <ContentRoute
        path="/financial-management/financials/cash"
        component={CashJournal}
      />

      {/* Business Unit Transaction */}
      <ContentRoute
        path="/financial-management/financials/businessUnitTransaction/edit/:id"
        component={
          busisnessTransaction?.isEdit ? BusinessUnitForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/financial-management/financials/businessUnitTransaction/add"
        component={
          busisnessTransaction?.isCreate ? BusinessUnitForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/financial-management/financials/businessUnitTransaction"
        component={BusinessUnitTransaction}
      />

      {/* Bulk Bank Receive */}
      <ContentRoute
        path="/financial-management/financials/bulkbankreceive"
        component={BulkBankReceive}
      />

      {/* Accounting Closing */}
      <ContentRoute
        path="/financial-management/financials/accountingclosing"
        component={AccountClosingCreateForm}
      />

      {/* Bank Advice */}
      <ContentRoute
        path="/financial-management/financials/bankadvice"
        component={BankAdvice}
      />
      {/* Back Statement Correction */}
      <ContentRoute
        path="/financial-management/financials/bankStatementCorrection"
        component={BankStateMentCorrectionLanding}
      />
      <ContentRoute
        path="/financial-management/financials/manual-reconcile"
        component={ManualReconcileLanding}
      />
      {/* Bank Statement */}
      <ContentRoute
        path="/financial-management/financials/bankStatementUpload"
        component={BankStatement}
      />

      {/* Payment Advice */}
      <ContentRoute
        path="/financial-management/financials/paymentAdvice"
        component={PaymentAdviceForm}
      />
      {/* TDS VDS JV Create */}
      <ContentRoute
        path="/financial-management/financials/TdsVdsJVCreate"
        component={TdsVdsJvLanding}
      />

      {/* Customer Bank Receive*/}
      <ContentRoute
        path="/financial-management/financials/customer-bank-receive"
        component={CustomerBankReceive}
      />

      {/* Budget Entry*/}
      <ContentRoute
        path="/financial-management/financials/budget-entry/create"
        component={BudgetEntryCreate}
      />
      <ContentRoute
        path="/financial-management/financials/budget-entry/edit/:sbuId/:monthId/:yearId"
        component={BudgetEntryCreate}
      />
      <ContentRoute
        path="/financial-management/financials/budget-entry/view/:sbuIdView/:monthId/:yearId"
        component={BudgetEntryCreate}
      />
      <ContentRoute
        path="/financial-management/financials/budget-entry"
        component={BudgetEntryLanding}
      />
      <ContentRoute
        path="/financial-management/financials/reconciliation-journal"
        component={ReconciliationJournal}
      />

      {/* Bulk JV */}
      <ContentRoute
        path="/financial-management/financials/bulk-JV"
        component={BulkJVLanding}
      />

      <ContentRoute
        path="/financial-management/financials/transfer-journal-tax"
        component={TransferJournalToTax}
      />
      <ContentRoute
        path="/financial-management/financials/limitBank/create"
        component={CreateBankLimit}
      />
      <ContentRoute
        path="/financial-management/financials/limitBank"
        component={BankLimit}
      />
      <ContentRoute
        path="/financial-management/financials/ProductionCosting"
        component={
          productionCostPermission?.isView ? ProductionCost : NotPermittedPage
        }
      />
      <ContentRoute
        path="/financial-management/financials/IncentiveBillpayment"
        component={IncentiveBillPaymentLanding}
      />
    </Switch>
  );
}
