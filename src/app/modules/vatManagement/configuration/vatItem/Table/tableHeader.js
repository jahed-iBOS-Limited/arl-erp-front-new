import React from 'react'
import { ITable } from '../../../../_helper/_table'
import { TableRow } from './tableRow'

export function VatItemTable() {
  return (
    <ITable link="/mngVat/cnfg-vat/vat-item/add" title=" Tax Item">
      <TableRow />
    </ITable>
  )
}
