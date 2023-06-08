import React from "react";
import { Route } from "react-router-dom";
import ViewModal  from "./View/viewModal";
import ExpenseRegisterLanding from "./Table/table";
import './style.css'


export function ExpenseRegister() {
  return (
    <div>
      <Route path="/self-service/tada-application/view/:id">
        {({ history, match }) => (
          <ViewModal
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/self-service/tada-application");
            }}
          />
        )}
      </Route>
      <ExpenseRegisterLanding />
    </div>
  );
}
