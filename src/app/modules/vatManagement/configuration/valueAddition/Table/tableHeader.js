import React from 'react'
import { ITable } from '../../../../_helper/_table'
import { TableRow } from './tableRow'

export function ValueAdditionTable() {
  return (
    <ITable
      link="/mngVat/cnfg-vat/value-addition/add"
      title=" Value Addition"
    >
      <TableRow />
    </ITable>
  )
}
