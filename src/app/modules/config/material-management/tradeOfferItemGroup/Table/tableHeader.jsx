import React from "react";
import { TableRow } from "./tableData";
import { ITable } from "../../../../_helper/_table";

export function TradeOfferItemGroupTable() {
  return (
    <ITable
      title="Trade Offer Item Group"
      link="/config/material-management/tradeofferitemgroup/add"
    >
      <TableRow />
    </ITable>
  );
}
