import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { SalesforceTransferTable } from "./Table/tableHeader";


export function SalesforceTransferLanding() {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <SalesforceTransferTable />
    </UiProvider>
  );
};
