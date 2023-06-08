import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { RouteTable } from "./Table/tableHeader";

export function RouteLanding() {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <RouteTable />
    </UiProvider>
  );
};
