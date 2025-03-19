import React from "react";
import { TableRow } from "./tableRow";

export function ServiceReceiveReportView({
  history,
  match: {
    params: { Rcid },
  },
}) {
  return (
      <TableRow Rcid ={Rcid}/>
  );
}
