import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function TransportZoneTable() {
  return (
    <ITable
      link="/transport-management/configuration/transportzone/add"
      title="Transport Zone"
    >
      <TableRow />
    </ITable>
  );
}
