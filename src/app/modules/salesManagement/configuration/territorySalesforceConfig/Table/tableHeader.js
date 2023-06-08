import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function TerritorySalesForceConfigTable() {
  return (
    <ITable
      link="/sales-management/configuration/territorysalesforceconfig/add"
      title="Territory SalesForce Config"
    >
      <TableRow />
    </ITable>
  );
}
