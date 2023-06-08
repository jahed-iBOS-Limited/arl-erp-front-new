import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { KpiTargetTable } from "./Table/tableHeader";

export function CorporateKpiEntryLanding({ history }) {
  const uIEvents = {
    openViewDialog: (id) => {
      history.push(`/performance-management/corporate-kpi/target/view/${id}`);
    },
    openChartPage: (id) => {
      history.push(
        `/performance-management/corporate-kpi/target/perform-chart/${id}`
      );
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <KpiTargetTable />
    </UiProvider>
  );
}
