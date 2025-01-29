import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import "./style.css";
import { ShipmentCostTable } from "./Table/tableHeader";

function ShipmentCostCancelLanding({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/mngVat/cnfg-vat/vat-item/edit/${id}`);
    },
    openViewDialog: (id) => {
      history.push(`/mngVat/cnfg-vat/vat-item/view/${id}`);
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <ShipmentCostTable />
    </UiProvider>
  );
}
export default ShipmentCostCancelLanding;
