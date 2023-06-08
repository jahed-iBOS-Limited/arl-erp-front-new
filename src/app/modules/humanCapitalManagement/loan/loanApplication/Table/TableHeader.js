import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./TableRow";

export default function LoanApplicationTable() {
  return (
    <ITable
      link="/human-capital-management/loan/loanapplication/create"
      title="Loan Application"
    >
        <TableRow></TableRow>
    </ITable>
  );
}
