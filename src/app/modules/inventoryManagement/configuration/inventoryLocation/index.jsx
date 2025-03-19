import React from "react";
import { PlantWarehouseLandingCard } from "./plantWarehouseTable/plantWarehouseLandingCard";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function InventoryLocation({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/inventory-management/configuration/inventory-location/edit/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <PlantWarehouseLandingCard />
    </UiProvider>
  );
};
