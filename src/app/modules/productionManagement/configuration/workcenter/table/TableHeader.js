import React, { useState } from "react";
import { ITable } from "../../../../_helper/_table";
import TableRow from "./TableRow";

export function WorkCenterTable() {
  const [selectedDDLPlant, setSelectedDDLPlant] = useState("");

  return (
    <ITable
      link={{
        pathname: "/production-management/configuration/workcenter/create",
        state: selectedDDLPlant,
      }}
      title="Work Center"
    >
      <TableRow setSelectedDDLPlant={setSelectedDDLPlant} />
    </ITable>
  );
}
