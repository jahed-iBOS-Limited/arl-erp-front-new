import React from "react";
import { LeaveMovementApplicationTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function LeaveMovementApplication({ history }) {
  const uIEvents = {};
  return (
    <UiProvider uIEvents={uIEvents}>
      <LeaveMovementApplicationTable />
    </UiProvider>
  );
}
