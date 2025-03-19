import React from "react";
import { VehicleTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function Vehicle({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/transport-management/configuration/vehicle/edit/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <VehicleTable />
    </UiProvider>
  );
};
