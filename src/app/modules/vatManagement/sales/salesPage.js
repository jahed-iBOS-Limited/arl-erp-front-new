import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import SalesForm from "./createSales/Form/addEditForm";
import { CreateSalesLanding } from "./createSales/Table/tableHeader";
import CreditNoteLanding from "./creditNote";
import CreditNoteCreateForm from "./creditNote/Form/addEditForm";
import SalesInvoiceIbosLanding from "./salesInvoiceIbos/Table";
import findIndex from "./../../_helper/_findIndex";
import NotPermittedPage from "./../../_helper/notPermitted/NotPermittedPage";
import AutoSalesInvoiceIbosLanding from "./autoSalesInvoiceIbos/Table";

export default function SalesPage() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const salesInv63 = userRole[findIndex(userRole, "Sales Invoice (6.3)")];
  const creditNote = userRole[findIndex(userRole, "Credit Note")];

  return (
    <Switch>
      <Redirect exact={true} from="/sales" to="/mngVat/sales" />
      {/* Credit-Note Routes */}

      <ContentRoute
        path="/mngVat/sales/credit-note/edit/:id"
        component={creditNote?.isEdit ? CreditNoteCreateForm : NotPermittedPage}
      />

      <ContentRoute
        path="/mngVat/sales/credit-note/add"
        component={
          creditNote?.isCreate ? CreditNoteCreateForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/mngVat/sales/credit-note"
        component={CreditNoteLanding}
      />

      {/* Tax Sales Route */}

      <ContentRoute
        path="/mngVat/sales/create/edit/:id"
        component={salesInv63?.isEdit ? SalesForm : NotPermittedPage}
      />
      <ContentRoute
        path="/mngVat/sales/create/create"
        component={salesInv63?.isCreate ? SalesForm : NotPermittedPage}
      />

      <ContentRoute
        path="/mngVat/sales/create"
        component={CreateSalesLanding}
      />
      {/* Sales Invoice Iboss */}
      <ContentRoute
        path="/mngVat/sales/salesInvoiceiBOS"
        component={SalesInvoiceIbosLanding}
      />
      <ContentRoute
        path="/mngVat/sales/autosalesInvoiceiBOS"
        component={AutoSalesInvoiceIbosLanding}
      />
    </Switch>
  );
}
