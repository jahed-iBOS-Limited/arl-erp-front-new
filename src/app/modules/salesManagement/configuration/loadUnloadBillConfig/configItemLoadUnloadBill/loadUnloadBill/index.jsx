import React from "react";
import { UiProvider } from "../../../../../_helper/uiContextHelper";
import { LoadUnloadBillConfigTable } from "./Table/tableHeader";

function LoadUnloadBillConfigLanding({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/mngVat/cnfg-vat/vat-item/edit/${id}`);
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <LoadUnloadBillConfigTable />
    </UiProvider>
  );
}
export default LoadUnloadBillConfigLanding;
