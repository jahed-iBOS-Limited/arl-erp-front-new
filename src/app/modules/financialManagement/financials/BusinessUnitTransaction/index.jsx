import React from "react";
import { ControllingUnitTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";
import './businessTransaction.css'

export function BusinessUnitTransaction({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/financial-management/financials/businessUnitTransaction/edit/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <ControllingUnitTable />
    </UiProvider>
  );
};
