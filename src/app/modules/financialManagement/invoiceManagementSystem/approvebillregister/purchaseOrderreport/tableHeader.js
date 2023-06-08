import React from "react";
import { TableRow } from "./tableRow";


export function PurchaseOrderReport({
  poId
}) {
  return (
      <TableRow poId={poId} orId={1} />
  );
}
