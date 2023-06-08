import React from "react";
import { TransportZoneTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function TransportZone({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/sales-management/configuration/transportzone/edit/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <TransportZoneTable />
    </UiProvider>
  );
};
