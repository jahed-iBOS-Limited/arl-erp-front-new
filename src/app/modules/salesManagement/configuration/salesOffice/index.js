import React from "react";

import { ControllingUnitTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function SalesOffice({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/sales-management/configuration/salesoffice/edit/${id}`);
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <ControllingUnitTable />
    </UiProvider>
  );
}
