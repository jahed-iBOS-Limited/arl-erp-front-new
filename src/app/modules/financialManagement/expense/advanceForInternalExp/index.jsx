import React from "react";

import { Route } from "react-router-dom";


import AdvanceForInternalExpLanding from "./Table/table";
import ViewForm from "./View/viewModal";


export function AdvanceForInternalExp() {
  return (
    <>
      <Route path="/financial-management/expense/advance/view/:id">
        {({ history, match }) => (
          <ViewForm
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/financial-management/expense/advance");
            }}
          />
        )}
      </Route>
      <AdvanceForInternalExpLanding />
    </>
  );
}
