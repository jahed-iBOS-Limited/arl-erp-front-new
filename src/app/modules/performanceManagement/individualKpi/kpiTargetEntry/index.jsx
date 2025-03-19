import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { KpiTargetTable } from "./Table/tableHeader";

export function KpiEntryLanding({ history }) {
  return (
    <UiProvider>
      <KpiTargetTable />
    </UiProvider>
  );
}
