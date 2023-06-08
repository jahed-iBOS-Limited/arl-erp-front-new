import React from 'react'
import { TableRow } from './tableRow'
import { ITable } from '../../../../_helper/_table'

export function BusinessPartnerProfileTable() {
  return (
    <ITable link="/mngVat/cnfg-vat/cnfg/add" title="Partner Profile">
      <TableRow />
    </ITable>
  )
}
