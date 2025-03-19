import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { TransportOrganizationTable } from "./Table/tableHeader";

function TranportOrganizationLanding({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(
        `/transport-management/configuration/transportorganization/edit/${id}`
      );
    },
    openViewDialog: (id) => {
      history.push(
        `/transport-management/configuration/transportorganization/view/${id}`
      );
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <TransportOrganizationTable />
    </UiProvider>
  );
}
export default TranportOrganizationLanding;
