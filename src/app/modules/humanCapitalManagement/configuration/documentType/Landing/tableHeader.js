import React from "react";
import { ITable } from "../../../../_helper/_table";
import { TableRow } from "./tableRow";

export function DocumentTypeTable() {
  return (
    <ITable link="/human-capital-management/hcmconfig/documenttype/create" 
    title="Document Attachment Type">
      <TableRow />
    </ITable>
  );
}
