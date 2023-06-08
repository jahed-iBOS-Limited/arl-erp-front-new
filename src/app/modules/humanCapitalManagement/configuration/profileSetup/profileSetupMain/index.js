import React from "react";
import { UiProvider } from "../../../../_helper/uiContextHelper";
import { ProfileSetupTable } from "./Table/tableHeader";

export function ProfileSetupLanding() {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <ProfileSetupTable />
    </UiProvider>
  );
}
