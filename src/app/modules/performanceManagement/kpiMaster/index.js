import React from "react";
import { UiProvider } from "../../_helper/uiContextHelper";

import { KpiTargetTable } from "./Table/tableHeader";

export function KpiLanding({ history }) {
  return (
    <UiProvider>
      <KpiTargetTable />
    </UiProvider>
  );
}
