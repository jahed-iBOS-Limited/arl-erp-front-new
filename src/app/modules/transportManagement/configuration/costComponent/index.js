import React from "react";
import { Route } from "react-router";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { CostComponentTable } from "./Table/tableHeader";
import CostComponentViewForm from "./view/addForm";

function CostComponentLanding({history}) {
  const uIEvents = {

    openViewDialog: (id) => {
      history.push(`/transport-management/configuration/costcomponent/view/${id}`);
    },
  };
  return (
    <div>
      <UiProvider uIEvents={uIEvents}>
        <Route path="/transport-management/configuration/costcomponent/view/:id">
          {({ history, match }) => (
            <CostComponentViewForm
              show={match != null}
              id={match && match.params.id}
              history={history}
              onHide={() => {
                history.push("/transport-management/configuration/costcomponent");
              }}
            />
          )}
        </Route>
        <CostComponentTable />
      </UiProvider>
    </div>
  );
}

export default CostComponentLanding;
