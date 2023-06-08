import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function RouteStandardLandingTable() {
  return (
    <ITable
      link="/transport-management/configuration/routestandardcost/add"
      title="Route Cost Setup"
    >
      <TableRow />
    </ITable>
  );
}
