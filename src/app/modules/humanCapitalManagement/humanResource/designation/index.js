import React from "react";
import { DepartmentTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function Designation({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/human-capital-management/humanresource/designation/edit/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <DepartmentTable />
    </UiProvider>
  );
};
