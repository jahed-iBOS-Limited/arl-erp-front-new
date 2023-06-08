import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { GatePassApplicationTable } from "./Table/tableHeader";

function GatePassApplicationLanding({ history }) {
  const uIEvents = {
    openEditPage: (id, type) => {
      history.push(
        `/inventory-management/gate-pass/gate-pass-application/edit/${id}`
      );
    },
    openViewDialog: (id, type) => {
      history.push(
        `/inventory-management/gate-pass/gate-pass-application/view/${id}`
      );
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <GatePassApplicationTable />
    </UiProvider>
  );
}
export default GatePassApplicationLanding;
