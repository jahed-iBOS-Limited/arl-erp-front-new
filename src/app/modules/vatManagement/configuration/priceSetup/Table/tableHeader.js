import React from 'react'
import { ITable } from '../../../../_helper/_table'
import { TableRow } from './tableRow'

export function PriceSetupTable() {
  return (
    <ITable link="/mngVat/cnfg-vat/priceSetup/add" title="Price Setup">
      <TableRow />
    </ITable>
  )
}
