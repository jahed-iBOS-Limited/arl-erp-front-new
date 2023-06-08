import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { PriceSetupTable } from "./Table/tableHeader";

export function PriceSetupLanding() {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <PriceSetupTable />
    </UiProvider>
  );
};
