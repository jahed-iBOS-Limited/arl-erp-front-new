import React from 'react'
import { TableRow } from './tableRow'
import { ITable } from '../../../../_helper/_table'

export function ProfitCenterTable() {
  return (
    <ITable
      link="/internal-control/configuration/profitcenter/add"
      title="Profit Center"
    >
      <TableRow />
    </ITable>
  )
}
