import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { RouteStandardLandingTable } from "./Table/tableHeader";

export function RouteStandardLanding() {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <RouteStandardLandingTable />
    </UiProvider>
  );
};
