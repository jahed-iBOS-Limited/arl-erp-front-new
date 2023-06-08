import React from 'react'
import { ITable } from '../../../../_helper/_table'
import { TableRow } from './tableRow'

export function BranchTable() {
  return (
    <ITable link="/mngVat/cnfg-vat/branch/add" title="Tax Branch">
      <TableRow />
    </ITable>
  )
}
