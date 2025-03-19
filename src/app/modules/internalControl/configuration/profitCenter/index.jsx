import React from "react";
import { ProfitCenterTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function ProfitCenter({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/internal-control/configuration/profitcenter/edit/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <ProfitCenterTable />
    </UiProvider>
  );
};
