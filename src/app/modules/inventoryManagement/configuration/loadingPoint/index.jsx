import React from "react";
import { LoadingPointTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export default function LoadingPoint({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
          history.push(`/inventory-management/configuration/loadingpoint/edit/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
          <LoadingPointTable />
    </UiProvider>
  );
};
