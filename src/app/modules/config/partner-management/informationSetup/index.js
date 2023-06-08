import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { ProfileSetupTable } from "./Table/tableHeader";

export default function InformationSetupLanding() {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <ProfileSetupTable />
    </UiProvider>
  );
}
