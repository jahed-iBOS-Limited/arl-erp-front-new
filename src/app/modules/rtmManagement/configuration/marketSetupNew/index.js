import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { TableHeader } from "./landing/tableHeader";

export function MarketSetupTable() {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <TableHeader />
    </UiProvider>
  );
}
