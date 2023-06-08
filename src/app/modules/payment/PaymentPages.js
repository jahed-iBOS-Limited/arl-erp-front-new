import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { FinalcialPages } from "./financials/financialPages";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";
import { Suspense } from "react";
import { InvoiceManagementSystemPages } from "./invoiceManagementSystem/invoiceManagementSystemPages";
import { ExpensePages } from "./expense/expensePages";

export function PaymentPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/payment"
          to="/payment/invoicemanagement-system/billregister"
        />

        <ContentRoute
          path="/payment/financials"
          component={FinalcialPages}
        />

        <ContentRoute
          path="/payment/invoicemanagement-system"
          component={InvoiceManagementSystemPages}
        />
        <ContentRoute
          path="/payment/expense"
          component={ExpensePages}
        />
      </Switch>
    </Suspense>
  );
}

export default PaymentPages;
