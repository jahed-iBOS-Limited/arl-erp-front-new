import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function TransportOrganizationTable() {
  return (
    <ITable
      link="/transport-management/configuration/transportorganization/add"
      title=" Transport Organization"
    >
      <TableRow />
    </ITable>
  );
}
