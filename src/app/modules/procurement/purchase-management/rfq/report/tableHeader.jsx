import React from "react";
import { TableRow } from "./tableRow";

export function QuationEntryReport({
  history,
  match: {
    params: { prId },
  },
}) {
  return (
      <TableRow prId ={prId}/>
  );
}
