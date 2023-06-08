import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function ControllingUnitTable() {
  return (
    <ITable
      link="/financial-management/financials/businessUnitTransaction/add"
      title="Business Transaction"
    >
      <TableRow />
    </ITable>
  );
}
