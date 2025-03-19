import React from "react";
import { TableRow } from "./tableRow";
import { ITable } from "../../../../_helper/_table";

export function DistributionChannelTable() {
  return (
    <ITable
      link="/sales-management/configuration/distributionchannel/add"
      title="Distribution Channel"
    >
      <TableRow />
    </ITable>
  );
}
