import React from "react";
import { PurchaseOrderViewTableRow } from "./tableRow";
import { useParams } from 'react-router';

export function PurchaseOrderReport({
  history,
}) {
  const params = useParams()
  return (
      <PurchaseOrderViewTableRow poId={params?.poId} orId={params?.orId} />
  );
}
