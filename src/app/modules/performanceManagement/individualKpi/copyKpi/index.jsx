import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import CopyKpiForm from './Form/addEditForm';

export function CopyKpi({ history }) {

  return (
    <UiProvider>
      <CopyKpiForm />
    </UiProvider>
  );
}
