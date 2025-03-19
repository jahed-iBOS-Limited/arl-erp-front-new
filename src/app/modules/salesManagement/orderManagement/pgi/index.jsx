import React from "react";
import { PGITable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function PGI({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/sales-management/ordermanagement/pgi/edit/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <PGITable />
    </UiProvider>
  );
};
