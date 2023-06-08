import React from "react";
import { ConfigItemTypeGLLandingCard } from "./plantWarehouseTable/plantWarehouseLandingCard";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function ConfigItemTypeGL({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/config/material-management/config-item-type-gl/edit/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <ConfigItemTypeGLLandingCard />
    </UiProvider>
  );
}
