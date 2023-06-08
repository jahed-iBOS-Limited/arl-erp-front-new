import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { Suspense } from "react";
import {
  LayoutSplashScreen,
  ContentRoute,
} from "../../../../../_metronic/layout";
import { CreateSalesLanding } from "./salesInvoice/Table/tableHeader";
import SalesForm from "./salesInvoice/Form/addEditForm";
import CreditNoteLanding from './creditNote';
import CreditNoteCreateForm from './creditNote/Form/addEditForm';

export function SalesPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect exact={true} from="/operation" to="/operation/sales" />

        {/* salesInvoice Page */}
        <ContentRoute
          path="/operation/sales/salesInvoice/edit/:id"
          component={SalesForm}
        />
        <ContentRoute
          path="/operation/sales/salesInvoice/create"
          component={SalesForm}
        />
        <ContentRoute
          path="/operation/sales/salesInvoice"
          component={CreateSalesLanding}
        />

        {/* /credit-note */}
        <ContentRoute
          path="/operation/sales/credit-note/edit/:id"
          component={CreditNoteCreateForm}
        />
        <ContentRoute
          path="/operation/sales/credit-note/add"
          component={CreditNoteCreateForm}
        />
        <ContentRoute
          path="/operation/sales/credit-note"
          component={CreditNoteLanding}
        />
      </Switch>
    </Suspense>
  );
}

export default SalesPages;
