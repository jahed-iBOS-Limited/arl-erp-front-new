import React from "react";
import { CostCenterTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function CostCenter({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/financial-management/cost-controlling/cost_center/edit/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <CostCenterTable />
    </UiProvider>
  );
};
