import React from "react";
import { ProfitCenterGroupTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function ProfitCenterGroup({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/financial-management/cost-controlling/profit-center-group/edit/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <ProfitCenterGroupTable />
    </UiProvider>
  );
};
