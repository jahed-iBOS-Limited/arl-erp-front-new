import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { KpiTargetTable } from "./Table/tableHeader";

export function DepartmentalKpiEntryLanding({ history }) {
  const uIEvents = {
    openViewDialog: (id) => {
      history.push(
        `/performance-management/departmental-kpi/target/view/${id}`
      );
    },
    openChartPage: (id) => {
      history.push(
        `/performance-management/departmental-kpi/target/perform-chart/${id}`
      );
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <KpiTargetTable />
    </UiProvider>
  );
}
