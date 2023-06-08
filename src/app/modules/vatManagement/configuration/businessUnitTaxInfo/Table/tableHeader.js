import React from 'react'
import { ITable } from '../../../../_helper/_table'
import { TableRow } from './tableRow'

export function BusinessUnitTaxTable() {
  return (
    <ITable
      link="/mngVat/cnfg-vat/buTax/add"
      title="Business Unit Tax Info"
    >
      <TableRow />
    </ITable>
  )
}
