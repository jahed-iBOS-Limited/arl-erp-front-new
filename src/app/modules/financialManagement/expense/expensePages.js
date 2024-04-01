import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "./../../../../_metronic/layout/components/content/ContentRoute";
import AdvanceCreateForm from "./advanceForInternalExp/Create/addForm";
import ExpenseRegisterCreateForm from "./expenseRegister/Create/addForm";
import { ExpenseRegister } from "./expenseRegister";
import VesselExpenseCreateForm from "./vesselExpense/Create/addForm";
import { VesselExpenseLanding } from "./vesselExpense";
import { AdvanceForInternalExp } from "./advanceForInternalExp";
import CashReceiveForm from "./advanceForInternalExp/CashReceive/addForm";
import RecivePaymentCashForm from "./receivePayment/Cash/Form/addEditForm";
import RecivePaymentLanding from "./receivePayment/Table";
import RecivePaymentBankForm from "./receivePayment/Bank/Form/addEditForm";
import ExpenseInfoModify from "./expenseInfoModify";
import BareboatAndInsurancelanding from "./bareboatAndInsurance";
import DryDocLanding from "./dryDocSchedule";
import DryDocCreateEdit from "./dryDocSchedule/createEdit";
import IndustrialTestingCostLanding from "./industrialTestingCost/landing";
import IndustrialTestingCostEntryForm from "./industrialTestingCost/form/addEditForm";
// import BareboatAndInsuranceCreateEdit from "./bareboatAndInsurance/CreateEdit";
export function ExpensePages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/financial-management/expense"
        to="/financial-management/expense/expense-register"
      />

      {/* Route AdvanceForInternalExp */}
      <ContentRoute
        path="/financial-management/expense/advance/cashreceive/:cashreceive"
        component={CashReceiveForm}
      />
      <ContentRoute
        path="/financial-management/expense/advance/approval/:approval"
        component={AdvanceCreateForm}
      />

      <ContentRoute
        path="/financial-management/expense/advance/edit/:id"
        component={AdvanceCreateForm}
      />

      <ContentRoute
        path="/financial-management/expense/advance/create"
        component={AdvanceCreateForm}
      />
      <ContentRoute
        path="/financial-management/expense/advance"
        component={AdvanceForInternalExp}
      />

      {/* Route ExpenseRegister */}
      <ContentRoute
        path="/financial-management/expense/expense-register/approval/:approval"
        component={ExpenseRegisterCreateForm}
      />

      <ContentRoute
        path="/financial-management/expense/expense-register/edit/:id"
        component={ExpenseRegisterCreateForm}
      />
      <ContentRoute
        path="/financial-management/expense/expense-register/create"
        component={ExpenseRegisterCreateForm}
      />
      <ContentRoute
        path="/financial-management/expense/expense-register"
        component={ExpenseRegister}
      />
      {/* Route vessel expense */}
      <ContentRoute
        path="/financial-management/expense/vesselexpense/approval/:approval"
        component={VesselExpenseCreateForm}
      />
      <ContentRoute
        path="/financial-management/expense/vesselexpense/edit/:id"
        component={VesselExpenseCreateForm}
      />
      <ContentRoute
        path="/financial-management/expense/vesselexpense/create"
        component={VesselExpenseCreateForm}
      />
      <ContentRoute
        path="/financial-management/expense/vesselexpense"
        component={VesselExpenseLanding}
      />

      {/* RecivePaymentLanding route */}
      <ContentRoute
        path="/financial-management/expense/receivepayment/bank/:bank"
        component={RecivePaymentBankForm}
      />
      <ContentRoute
        path="/financial-management/expense/receivepayment/cash/:cash"
        component={RecivePaymentCashForm}
      />

      <ContentRoute
        path="/financial-management/expense/receivepayment"
        component={RecivePaymentLanding}
      />

      <ContentRoute
        path="/financial-management/expense/expenseModify"
        component={ExpenseInfoModify}
      />
      {/* <ContentRoute
        path="/financial-management/expense/VesselInsuranceNBareboat/create"
        component={BareboatAndInsuranceCreateEdit}
      /> */}
      <ContentRoute
        path="/financial-management/expense/VesselInsuranceNBareboat"
        component={BareboatAndInsurancelanding}
      />
      <ContentRoute
        path="/financial-management/expense/drydocschedule/edit/:id"
        component={DryDocCreateEdit}
      />
      <ContentRoute
        path="/financial-management/expense/drydocschedule/create"
        component={DryDocCreateEdit}
      />
      <ContentRoute
        path="/financial-management/expense/drydocschedule"
        component={DryDocLanding}
      />
      <ContentRoute
        path="/financial-management/expense/industrialtestingcost/entry"
        component={IndustrialTestingCostEntryForm}
      />
      <ContentRoute
        path="/financial-management/expense/industrialtestingcost"
        component={IndustrialTestingCostLanding}
      />
    </Switch>
  );
}
