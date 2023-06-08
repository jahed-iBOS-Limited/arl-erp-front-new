import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function VehicleTable() {
  return (
    <ITable
      link="/transport-management/configuration/vehicle/add"
      title="Vehicle"
    >
      <TableRow />
    </ITable>
  );
}
