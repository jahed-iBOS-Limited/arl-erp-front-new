import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { AdvanceForInternalExp } from "../../financialManagement/expense/advanceForInternalExp";
import CashReceiveForm from "../../financialManagement/expense/advanceForInternalExp/CashReceive/addForm";
import AdvanceCreateForm from "../../financialManagement/expense/advanceForInternalExp/Create/addForm";
import ExpenseInfoModify from "../../financialManagement/expense/expenseInfoModify";
import { ExpenseRegister } from "../../financialManagement/expense/expenseRegister";
import ExpenseRegisterCreateForm from "../../financialManagement/expense/expenseRegister/Create/addForm";
import { ContentRoute } from "./../../../../_metronic/layout/components/content/ContentRoute";

export function ExpensePages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/payment/expense"
        to="/payment/expense/expense-register"
      />
      <ContentRoute
        path="/payment/expense/expense-register/approval/:approval"
        component={ExpenseRegisterCreateForm}
      />

      <ContentRoute
        path="/payment/expense/expense-register/edit/:id"
        component={ExpenseRegisterCreateForm}
      />
      <ContentRoute
        path="/payment/expense/expense-register/create"
        component={ExpenseRegisterCreateForm}
      />
      <ContentRoute
        path="/payment/expense/expense-register"
        component={ExpenseRegister}
      />
      <ContentRoute
        path="/payment/expense/expenseModify"
        component={ExpenseInfoModify}
      />
      <ContentRoute
        path="/payment/expense/advance/cashreceive/:cashreceive"
        component={CashReceiveForm}
      />
      <ContentRoute
        path="/payment/expense/advance/approval/:approval"
        component={AdvanceCreateForm}
      />

      <ContentRoute
        path="/payment/expense/advance/edit/:id"
        component={AdvanceCreateForm}
      />

      <ContentRoute
        path="/payment/expense/advance/create"
        component={AdvanceCreateForm}
      />
      <ContentRoute
        path="/payment/expense/advance"
        component={AdvanceForInternalExp}
      />
    </Switch>
  );
}
