import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { ProfitCenterTable } from "./Table/tableHeader";

export function ProfitCenterGroup({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(
        `/financial-management/cost-controlling/profitcenter/edit/${id}`
      );
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <ProfitCenterTable />
    </UiProvider>
  );
}
