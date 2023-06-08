import React from "react";
import { CustomerVisitTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function CustomerVisitLanding({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(
        `/sales-management/ordermanagement/customerVisit/edit/${id}`
      );
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <CustomerVisitTable />
    </UiProvider>
  );
}
