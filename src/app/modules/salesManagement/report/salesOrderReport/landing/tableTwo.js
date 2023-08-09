import React from "react";
import ICustomTable from "../../../../_helper/_customTable";

const ths = [
  "SL",
  "Reference No",
  "specification",
  "Ship To Party",
  "Item Code",
  "Item Name",
  "Customer Item Name",
  "Uom",
  "Is Free",
  "Quantity",
  "Transport Rate",
  "Basic Price",
  "Water Proof Rate",
  "Pump Charge Rate",
  "Amount",
  "Discount",
  "Net Value",
];

export default function TableTwo() {
  return (
    <>
      <ICustomTable ths={ths}></ICustomTable>
    </>
  );
}
