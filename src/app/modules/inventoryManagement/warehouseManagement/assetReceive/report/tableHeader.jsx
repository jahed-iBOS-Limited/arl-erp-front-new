import React from "react";
import { TableRow } from "./tableRow";

export function AssetReceiveReportView({
  history,
  match: {
    params: { Asid },
  },
}) {
  return (
      <TableRow Asid ={Asid}/>
  );
}
