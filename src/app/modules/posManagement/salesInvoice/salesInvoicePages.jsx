import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { Suspense } from "react";
import SalesInvoiceForm from "./Form/addEditForm"
import SalesInvoice from "./landing/landing"
import CustomerCreditRecoveryForm from "./customerCreditRecovery/addEditForm"
import VoucherLanding from "../createVoucher/landing/table";
import CreateVoucherForm from "../createVoucher/form/addEditForm";

export function SalesInvoicePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact
          from="/pos-management"
          to="/pos-management/sales/sales-invoice"
        />

        <ContentRoute
          exact
          path="/pos-management/sales/sales-invoice/edit/:id"
          component={SalesInvoiceForm}
        />

        <ContentRoute
          exact
          path="/pos-management/sales/sales-invoice/create"
          component={SalesInvoiceForm}
        />
        <ContentRoute
          exact
          path="/pos-management/sales/sales-invoice"
          component={SalesInvoice}
        />
        <ContentRoute
          exact
          path="/pos-management/sales/customerCreditRecovery"
          component={CustomerCreditRecoveryForm}
        />
        <ContentRoute
          exact
          path="/pos-management/sales/create-voucher/create"
          component={CreateVoucherForm}
        />
        <ContentRoute
          exact
          path="/pos-management/sales/create-voucher/edit/:id"
          component={CreateVoucherForm}
        />
        <ContentRoute
          exact
          path="/pos-management/sales/create-voucher"
          component={VoucherLanding}
        />
      </Switch>
    </Suspense>
  );
}

export default SalesInvoicePage;
