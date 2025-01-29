import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { Route } from "react-router-dom";
// import  ViewForm  from "./ViewOld/viewModal";
import { BillofMaterialTable } from "./Table/tableHeader";

export function BillOfMaterialLanding({ history }) {
  const uIEvents = {
    openViewDialog: (id) => {
      history.push(`/production-management/mes/bill-of-material/view/${id}`);
    },
    openEditPage: (id) => {
      history.push(`/production-management/mes/bill-of-material/edit/${id}`);
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <Route path="/production-management/mes/bill-of-material/view/:id">
        {/* {({ history, match }) => (
          <ViewForm
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/production-management/mes/bill-of-material")
            }} />
        )} */}
      </Route>
      <BillofMaterialTable />
    </UiProvider>
  );
}
