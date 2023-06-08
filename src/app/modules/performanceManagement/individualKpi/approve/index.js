import React from "react";
import { Route } from "react-router-dom";
import ApproveTable from "./Table/table.js";
import Form from "./View/viewModal.js";

export default function Approve() {
  return (
    <>
      <ApproveTable />
      <Route path="/performance-management/individual-kpi/individual-kpi-approve/view/:kpiId/:frId/:year/:enroll">
        {({ history, match }) => (
          <Form
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push(
                "/performance-management/individual-kpi/individual-kpi-approve"
              );
            }}
          />
        )}
      </Route>
    </>
  );
}
