import React from "react";
import { CostElementTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function CostElement({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/financial-management/cost-controlling/costelement/edit/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <CostElementTable />
    </UiProvider>
  );
};
