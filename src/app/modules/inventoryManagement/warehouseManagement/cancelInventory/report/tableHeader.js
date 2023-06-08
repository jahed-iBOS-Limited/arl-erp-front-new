import React from "react";
import { TableRow } from "./tableRow";

export function CancelInvReportView({
  history,
  match: {
    params: { CrId },
  },
}) {
  return (
      <TableRow CrId ={CrId}/>
  );
}
