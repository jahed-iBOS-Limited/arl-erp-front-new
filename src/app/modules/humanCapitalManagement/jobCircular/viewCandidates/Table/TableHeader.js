import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./TableRow";
import '../loanApplication.css'

export default function ViewCandidates() {
  return (
    <div className="hide_create_btn">
    <ITable
      link="/human-capital-management/loan/loanapplication/create"
      title="View Candidates"
    >
        <TableRow></TableRow>
    </ITable>
    </div>
  );
}
