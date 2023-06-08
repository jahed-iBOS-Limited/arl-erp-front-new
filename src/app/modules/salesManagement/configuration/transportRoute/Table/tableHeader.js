import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function TransportRouteTable() {
  return (
    <ITable
      link="/sales-management/configuration/transportroute/add"
      title="Transport Route"
    >
      <TableRow />
    </ITable>
  );
}
