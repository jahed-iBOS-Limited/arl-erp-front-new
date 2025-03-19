import React from "react";
import { CodeGenerateTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function CodeGenerate({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/config/domain-controll/code-generate/edit/${id}`);
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <CodeGenerateTable />
    </UiProvider>
  );
};
