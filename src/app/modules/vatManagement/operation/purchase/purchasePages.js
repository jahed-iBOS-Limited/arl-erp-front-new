import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { Suspense } from "react";
import {
  LayoutSplashScreen,
  ContentRoute,
} from "../../../../../_metronic/layout";
import PurchaseLanding from "./parchase";
import PurchaseForm from "./parchase/Form/addEditForm";
import SalesDebitNote from './debitNote/index';
import SalesDebitNoteCreateForm from './debitNote/Form/AddEditForm';

export function PurchasePages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect exact={true} from="/operation" to="/operation/purchase" />

        {/* PurchaseLanding route */}
        <ContentRoute
          path="/operation/purchase/purchase/edit/:id"
          component={PurchaseForm}
        />
        <ContentRoute
          path="/operation/purchase/purchase/create"
          component={PurchaseForm}
        />
        <ContentRoute
          path="/operation/purchase/purchase"
          component={PurchaseLanding}
        />

        {/* SalesDebitNote */}
        <ContentRoute
          path="/operation/purchase/debit-note/add"
          component={SalesDebitNoteCreateForm}
        />
        <ContentRoute
          path="/operation/purchase/debit-note/edit/:id"
          component={SalesDebitNoteCreateForm}
        />
        <ContentRoute
          path="/operation/purchase/debit-note"
          component={SalesDebitNote}
        />

      </Switch>
    </Suspense>
  );
}

export default PurchasePages;
