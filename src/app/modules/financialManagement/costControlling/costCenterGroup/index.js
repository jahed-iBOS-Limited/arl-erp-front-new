import React from "react";
import { CostCenterGroupTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function CostCenterGroup({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/financial-management/cost-controlling/costcenter-group/edit/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <CostCenterGroupTable />
    </UiProvider>
  );
};
