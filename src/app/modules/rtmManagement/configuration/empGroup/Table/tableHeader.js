import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function EmpGroupTable() {
  return (
    <ITable
      link="/rtm-management/configuration/employeeGroup/create"
      title="Employee Group"
    >
      <TableRow />
    </ITable>
  );
}
