import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
// import OtherAdjustmentCreditNote from "./creditNote";
// import OtherAdjusmentCreditNoteForm from "./creditNote/Form/AddEditForm";
import OtherAdjustmentDebitNote from "./debitNote";
import OtherAdjusmentDebitNoteForm from "./debitNote/Form/AddEditForm";
import CreditNoteLanding from "./credit_Note/Table/index";
import CreditNoteFrom from "./credit_Note/Form/addEditForm";
import VatAdjustmentCreateForm from "../voucher/vatAdjustment/create/addForm";
import VatAdjustmentLanding from "../voucher/vatAdjustment";
import findIndex from "./../../_helper/_findIndex";
import NotPermittedPage from "./../../_helper/notPermitted/NotPermittedPage";

export function OtherAdjustmentPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const debitNote = userRole[findIndex(userRole, "Debit Note")];
  const creditNote = userRole[findIndex(userRole, "Credit Note")];

  return (
    <Switch>
      <Redirect exact={true} from="/vat" to="/mngVat/otherAdjustment" />
      {/** DEBIT_NOTE ROUTE */}

      <ContentRoute
        path="/mngVat/otherAdjustment/debit-note/create"
        component={
          debitNote?.isCreate ? OtherAdjusmentDebitNoteForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/mngVat/otherAdjustment/debit-note/edit/:id"
        component={
          debitNote?.isEdit ? OtherAdjusmentDebitNoteForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/mngVat/otherAdjustment/debit-note"
        component={OtherAdjustmentDebitNote}
      />

      {/* CREDIT_NOTE ROUTE */}
      {/* <ContentRoute
        path="/mngVat/otherAdjustment/credit-note/create"
        component={OtherAdjusmentCreditNoteForm}
      />
      <ContentRoute
        path="/mngVat/otherAdjustment/credit-note/edit/:id"
        component={OtherAdjusmentCreditNoteForm}
      />
      <ContentRoute
        path="/mngVat/otherAdjustment/credit-note"
        component={OtherAdjustmentCreditNote}
      /> */}

      {/* <ContentRoute
        path="/mngVat/otherAdjustment/credit-note/edit/:id"
        component={CreditNoteFrom}
      /> */}
      <ContentRoute
        path="/mngVat/otherAdjustment/credit-note/add"
        component={creditNote?.isCreate ? CreditNoteFrom : NotPermittedPage}
      />
      <ContentRoute
        path="/mngVat/otherAdjustment/credit-note"
        component={CreditNoteLanding}
      />

      {/* Vat-Adjustment */}
      <ContentRoute
        path="/mngVat/otherAdjustment/vat-adjustment/edit/:id"
        component={VatAdjustmentCreateForm}
      />

      <ContentRoute
        path="/mngVat/otherAdjustment/vat-adjustment/create"
        component={VatAdjustmentCreateForm}
      />

      <ContentRoute
        path="/mngVat/otherAdjustment/vat-adjustment"
        component={VatAdjustmentLanding}
      />
    </Switch>
  );
}
