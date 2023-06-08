import React from "react";
import { BankAccountTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { Route } from "react-router-dom";
import { ViewModal } from "./bankAccountView/ViewModal";


export function BankAccount({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(
        `/financial-management/configuration/bank-account/edit/${id}`
      );
    },
    openViewDialog: (id) => {
      history.push(
        `/financial-management/configuration/bank-account/view/${id}`
      );
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <Route path="/financial-management/configuration/bank-account/view/:id">
        {({ history, match }) => (
          <ViewModal
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/financial-management/configuration/bank-account");
            }}
          />
        )}
      </Route>
      <BankAccountTable />
    </UiProvider>
  );
}
