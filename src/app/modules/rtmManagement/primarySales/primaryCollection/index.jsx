import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { PrimaryCollectionTable } from './Table/tableHeader';

export function PrimaryCollectionPaginationLanding() {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <PrimaryCollectionTable />
    </UiProvider>
  );
};