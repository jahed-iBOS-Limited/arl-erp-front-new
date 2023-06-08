import React from "react";
import { SalesContactTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function SalesContract({ history }) {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <SalesContactTable />
    </UiProvider>
  );
}
