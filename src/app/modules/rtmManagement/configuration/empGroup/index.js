import React from "react";

import { Route } from "react-router-dom";
import { EmpGroupTable } from "./Table/tableHeader";
import ViewForm from "./View/viewModal";

export function EmpGroupModal({ history }) {
  return (
    <>
      <Route path="/rtm-management/configuration/employeeGroup/view/:id">
        {({ history, match }) => (
          <ViewForm
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/rtm-management/configuration/employeeGroup");
            }}
          />
        )}
      </Route>
      <EmpGroupTable />
    </>
  );
}
