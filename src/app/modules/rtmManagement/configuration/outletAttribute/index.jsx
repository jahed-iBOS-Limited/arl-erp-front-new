import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { OutletAttributeTable } from "./Table/tableHeader";

export function OutletAttributeLanding() {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <OutletAttributeTable />
    </UiProvider>
  );
}
