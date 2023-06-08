import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { PartnerWiseRentSetupLandingTable } from "./Table/tableHeader";

export function PartnerWiseRentSetupLanding() {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <PartnerWiseRentSetupLandingTable />
    </UiProvider>
  );
}
