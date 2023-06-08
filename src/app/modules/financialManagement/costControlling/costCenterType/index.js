import React from "react";
import { CostCenterTypeTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function CostCenterType({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(
        `/financial-management/cost-controlling/costcenter-type/edit/${id}`
      );
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <CostCenterTypeTable />
    </UiProvider>
  );
}
