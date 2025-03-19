import React from "react";
import { SalesOrganizationTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function SalesOrganization({ history }) {
  const uIEvents = {
    openExtendPage: (id) => {
      history.push(`/sales-management/configuration/salesorganization/extend/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <SalesOrganizationTable />
    </UiProvider>
  );
};
