import React from "react";
import { DistributionChannelTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function DistributionChannel({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(
        `/sales-management/configuration/distributionchannel/edit/${id}`
      );
    },
  };
  return (
    <UiProvider uIEvents={uIEvents}>
      <DistributionChannelTable />
    </UiProvider>
  );
}
