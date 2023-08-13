import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermitted from "../../performanceManagement/notPermittedPage/notPermitted";
import AccountJournal from './accountJournal'
import BankJournalEdit from "./accountJournal/EditForm/bankJournal/addForm";
import CashJournalEditForm from "./accountJournal/EditForm/cashJournal/cashJournalForm";
import AdjustmentJournal from "./accountJournal/form/adjustmentJournal/addEditForm";
import BankJournalCreate from "./accountJournal/form/bankJournal/addForm";
import CashJournalForm from "./accountJournal/form/cashJournalCreate/cashJournalForm";
import BankStatementAutomation from "./bankStatementAutomation";

export default function FinancialPages() {

  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let accountJournalPermission = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 986) {
      accountJournalPermission = userRole[i];
    }
  }

  return (
    <Switch>
      <Redirect exact={true} from="/purchase" to="/mngVat/tax-financial" />

      <ContentRoute
        path="/mngVat/tax-financial/account-journal"
        component={AccountJournal}
      />
      {/* Account Journal Create */}
      <ContentRoute
        path="/mngVat/tax-financial/account-journalCreate/cashJournalCreate"
        component={accountJournalPermission?.isCreate ? CashJournalForm : NotPermitted}
      />
      <ContentRoute
        path="/mngVat/tax-financial/account-journalCreate/cashJournalEdit/:journalCode"
        component={accountJournalPermission?.isEdit ? CashJournalEditForm : NotPermitted}
      />
      <ContentRoute
        path="/mngVat/tax-financial/account-journalCreate/bankJournalCreate"
        component={accountJournalPermission?.isCreate ? BankJournalCreate : NotPermitted}
      />
      <ContentRoute
        path="/mngVat/tax-financial/account-journalCreate/bankJournalEdit/:journalCode"
        component={accountJournalPermission?.isEdit ? BankJournalEdit : NotPermitted}
      />
      <ContentRoute
        path="/mngVat/tax-financial/account-journalCreate/adjustmentJournalEdit/:journalCode"
        component={accountJournalPermission?.isEdit ? AdjustmentJournal : NotPermitted}
      />
      <ContentRoute
        path="/mngVat/tax-financial/account-journalCreate/adjustmentJournalCreate"
        component={accountJournalPermission?.isCreate ? AdjustmentJournal : NotPermitted}
      />
      <ContentRoute
        path="/mngVat/tax-financial/account-journalCreate"
        component={accountJournalPermission?.isView ? AccountJournal : NotPermitted}
      />
      <ContentRoute
        path="/mngVat/tax-financial/bank-statement-automation"
        component={BankStatementAutomation}
      />
    </Switch>
  );
}
