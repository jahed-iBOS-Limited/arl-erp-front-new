import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function SalesContactTable() {
  return (
    <ITable
      link="/sales-management/ordermanagement/salescontract/add"
      title="Sales Contract"
    >
      <TableRow />
    </ITable>
  );
}
