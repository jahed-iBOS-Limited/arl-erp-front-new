import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function TradeOfferTable() {
  return (
    <ITable
      link="/config/material-management/tradeoffersetup/add"
      title="Trader Offer"
    >
      <TableRow />
    </ITable>
  );
}
