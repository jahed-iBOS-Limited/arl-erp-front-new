import React from "react";
import { PartnerThanaRateTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function PartnerThanaRate({ history }) {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <PartnerThanaRateTable />
    </UiProvider>
  );
}
