import React from "react";
import { PmsDimensionTable } from "./Table/tableHeader";
import { UiProvider } from "../../_helper/uiContextHelper";

export function PmsDimension({ history }) {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <PmsDimensionTable />
    </UiProvider>
  );
}
