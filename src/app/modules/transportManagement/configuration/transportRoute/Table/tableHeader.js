import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function TransportRouteTable() {
  return (
    <ITable
      link="/transport-management/configuration/transportroute/add"
      title="Transport Route"
    >
      <TableRow />
    </ITable>
  );
}
