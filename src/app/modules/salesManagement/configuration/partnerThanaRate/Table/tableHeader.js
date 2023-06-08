import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function PartnerThanaRateTable() {
  return (
    <ITable
      link="/sales-management/configuration/partnerThanaRate/add"
      title="Partner Transport Zone Setup"
    >
      <TableRow />
    </ITable>
  );
}
