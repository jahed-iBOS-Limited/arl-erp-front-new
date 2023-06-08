import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { CalenderSetUpTable } from "./Table/tableHeader";

function CalenderSetUpLanding({ history }) {
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
      <CalenderSetUpTable />
    </UiProvider>
  );
}
export default CalenderSetUpLanding;
