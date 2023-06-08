import React from "react";
import { WorkplaceGroupTable } from "./Table/TableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export default function WorkingGroup({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(
        `/human-capital-management/hcmconfig/workplcgroup/edit/${id}`
      );
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <WorkplaceGroupTable />
    </UiProvider>
  );
}
