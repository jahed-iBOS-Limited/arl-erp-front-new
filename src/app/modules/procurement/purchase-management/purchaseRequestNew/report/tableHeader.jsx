import React from "react";
import { ItemReqViewTableRow } from "./tableRow";

export function PurchaseRequestReport({
  history,
  match: {
    params: { prId },
  },
}) {
  return (
      <ItemReqViewTableRow prId ={prId}/>
  );
}
