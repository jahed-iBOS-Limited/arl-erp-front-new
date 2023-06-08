import React from "react";
import { MeasureTable } from "./Table/tableHeader";
import { UiProvider } from "../../_helper/uiContextHelper";

export function MeasuringScaleMain({ history }) {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <MeasureTable />
    </UiProvider>
  );
}
