import React from "react";
import { StrategicParticularsTable } from "./Table/tableHeader";
import { UiProvider } from "../../_helper/uiContextHelper";

export function StrategicParticulars({ history }) {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <StrategicParticularsTable />
    </UiProvider>
  );
}
