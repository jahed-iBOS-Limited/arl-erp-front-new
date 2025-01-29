import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { SalesforceTable } from "./Table/tableHeader";
import "./routesetup.css";

export function RouteSetupLanding() {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <SalesforceTable />
    </UiProvider>
  );
};
