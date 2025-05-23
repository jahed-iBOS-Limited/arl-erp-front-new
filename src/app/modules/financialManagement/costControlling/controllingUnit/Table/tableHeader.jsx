import React from 'react';
import { TableRow } from './tableRow';
import { ITable } from '../../../../_helper/_table';

export function ControllingUnitTable() {
  return (
    <ITable
      link="/financial-management/cost-controlling/controlling-unit/add"
      title="Controlling Unit"
    >
      <TableRow />
    </ITable>
  );
}
