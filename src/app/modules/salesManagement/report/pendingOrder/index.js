import React from "react";
import { PendingOrderTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function PendingOrder({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/sales-management/ordermanagement/pendingOrder/edit/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <PendingOrderTable />
    </UiProvider>
  );
};
