import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function ControllingUnitTable() {
  return (
    <ITable
      link="/sales-management/configuration/salesoffice/add"
      title="Sales Office"
    >
      <TableRow />
    </ITable>
  );
}
