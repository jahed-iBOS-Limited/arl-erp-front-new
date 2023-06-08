import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import TresuaryDepositLanding from "./tresuaryDeposit";
import TresuaryDepositForm from "./tresuaryDeposit/Form/addEditForm";
import findIndex from "./../../_helper/_findIndex";
import NotPermittedPage from "./../../_helper/notPermitted/NotPermittedPage";

export default function TransactionPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const treasury = userRole[findIndex(userRole, "Treasury")];

  return (
    <Switch>
      <Redirect exact={true} from="/transaction" to="/mngVat/transaction" />
      {/* transaction/treasury routes */}
      <ContentRoute
        path="/mngVat/transaction/treasury/edit/:id"
        component={treasury?.isEdit ? TresuaryDepositForm : NotPermittedPage}
      />
      <ContentRoute
        path="/mngVat/transaction/treasury/add"
        component={treasury?.isCreate ? TresuaryDepositForm : NotPermittedPage}
      />
      <ContentRoute
        path="/mngVat/transaction/treasury"
        component={TresuaryDepositLanding}
      />
    </Switch>
  );
}
