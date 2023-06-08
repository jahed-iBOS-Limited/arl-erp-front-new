import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

const initialData = {
  pendingOrderShippoint: "",
};

export function PendingOrderTable() {
  return (
    <div className="pendingOrderTable">
      <ITable
        link="/sales-management/ordermanagement/pendingOrder/add"
        title="Pending Order"
      >
        <TableRow initialData={initialData} />
      </ITable>
    </div>
  );
}
