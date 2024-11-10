import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./TableRow";

export default function AddNewCircular() {
  return (
    <ITable
      link="/human-capital-management/loan/loanapplication/create"
      title="Add New Circular"
    >
        <TableRow></TableRow>
    </ITable>
  );
}
