import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import PurchaseLanding from "./parchase-6.4";
import PurchaseForm from "./parchase-6.4/Form/addEditForm";

import SalesDebitNote from "./debitNote";
import SalesDebitNoteCreateForm from "./debitNote/Form/AddEditForm";
import findIndex from "./../../_helper/_findIndex";
import NotPermittedPage from "./../../_helper/notPermitted/NotPermittedPage";

export default function PurchasePages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const purchase64 = userRole[findIndex(userRole, "Purchase (6.4)")];
  const debitNote = userRole[findIndex(userRole, "Debit Note")];

  return (
    <Switch>
      <Redirect exact={true} from="/purchase" to="/mngVat/purchase" />

      {/* Purchase */}
      {/* <ContentRoute
        path="/mngVat/purchase/6.4/view/:id"
        component={ViewPurchase}
      /> */}
      <ContentRoute
        path="/mngVat/purchase/6.4/edit/:id"
        component={purchase64?.isEdit ? PurchaseForm : NotPermittedPage}
      />
      <ContentRoute
        path="/mngVat/purchase/6.4/create"
        component={purchase64?.isCreate ? PurchaseForm : NotPermittedPage}
      />
      <ContentRoute path="/mngVat/purchase/6.4" component={PurchaseLanding} />

      {/* Debit Note Routes */}
      <ContentRoute
        path="/mngVat/purchase/debit-note/add"
        component={
          debitNote?.isCreate ? SalesDebitNoteCreateForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/mngVat/purchase/debit-note/edit/:id"
        component={
          debitNote?.isEdit ? SalesDebitNoteCreateForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/mngVat/purchase/debit-note"
        component={SalesDebitNote}
      />
    </Switch>
  );
}
