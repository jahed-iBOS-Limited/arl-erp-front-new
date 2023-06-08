import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function EmpGroupTable() {
  return (
    <ITable
      link="/human-capital-management/hcmconfig/emp-group/create"
      title="Employee Group"
    >
      <TableRow />
    </ITable>
  );
}
