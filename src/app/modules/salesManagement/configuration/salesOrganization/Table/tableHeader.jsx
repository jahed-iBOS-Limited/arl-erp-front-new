import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function SalesOrganizationTable() {
  return (
    <ITable
      link="/sales-management/configuration/salesorganization/add"
      title="Sales Organization"
    >
      <TableRow />
    </ITable>
  );
}
