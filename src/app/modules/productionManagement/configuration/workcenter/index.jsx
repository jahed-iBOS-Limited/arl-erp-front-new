import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { WorkCenterTable } from "./table/TableHeader";

export function WorkCenter({ history }) {
  const uIEvents = {
    // openEditPage: (id) => {
    //   history.push(`/financial-management/cost-controlling/controlling-unit/edit/${id}`);
    // }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <WorkCenterTable />
    </UiProvider>
  );
}
