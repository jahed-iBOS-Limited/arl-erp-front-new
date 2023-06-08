import React from 'react'
import { ITable } from '../../../../_helper/_table'
import { TableRow } from './TableRow'

export default function OtherAdjustmentDebitNoteTable() {
  return (
    <ITable
      link="/mngVat/otherAdjustment/debit-note/create"
      title="Debit Note"
    >
      <TableRow></TableRow>
    </ITable>
  )
}
