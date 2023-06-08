import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { YearlyLeravePolocyTable } from "./Table/tableHeader";

function YearlyLeavePolicyLanding({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(
        `/human-capital-management/calendar/calandersetup/edit/${id}`
      );
    },
    openViewDialog: (id) => {
      history.push(
        `/human-capital-management/calendar/calandersetup/view/${id}`
      );
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <YearlyLeravePolocyTable />
    </UiProvider>
  );
}
export default YearlyLeavePolicyLanding;
