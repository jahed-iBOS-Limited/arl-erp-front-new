import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function RouteTable() {
  return (
    <ITable
      link="/rtm-management/configuration/route/add"
      title="Route"
    >
      <TableRow />
    </ITable>
  );
}
