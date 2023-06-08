import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function DepartmentTable() {
  return (
    <ITable
      link="/human-capital-management/humanresource/designation/add"
      title="Employee Designation"
    >
      <TableRow />
    </ITable>
  );
}
