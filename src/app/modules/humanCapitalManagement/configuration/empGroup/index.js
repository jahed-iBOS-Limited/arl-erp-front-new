import React from "react";

import { Route } from "react-router-dom";
import { EmpGroupTable } from "./Table/tableHeader";
import ViewForm from "./View/viewModal";

export function EmpGroupModal({ history }) {
  return (
    <>
      <Route path="/human-capital-management/hcmconfig/emp-group/view/:id">
        {({ history, match }) => (
          <ViewForm
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/human-capital-management/hcmconfig/emp-group");
            }}
          />
        )}
      </Route>
      <EmpGroupTable />
    </>
  );
}
