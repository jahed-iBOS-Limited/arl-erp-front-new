import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { SecondaryOrderTable } from "./Table/tableHeader";

export function SecondaryOrderLanding() {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <SecondaryOrderTable />
    </UiProvider>
  );
};
