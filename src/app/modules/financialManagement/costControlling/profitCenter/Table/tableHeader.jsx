import React from 'react'
import { ITable } from '../../../../_helper/_table'

import { TableRow } from './tableRow'

export function ProfitCenterTable() {
  return (
    <ITable
      link="/financial-management/cost-controlling/profitcenter/add"
      title="Profit Center"
    >
      <TableRow />
    </ITable>
  )
}
