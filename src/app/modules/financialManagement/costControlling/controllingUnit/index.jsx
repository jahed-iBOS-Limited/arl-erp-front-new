import React from "react";
import { ControllingUnitTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function ControllingUnit({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/financial-management/cost-controlling/controlling-unit/edit/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <ControllingUnitTable />
    </UiProvider>
  );
};
