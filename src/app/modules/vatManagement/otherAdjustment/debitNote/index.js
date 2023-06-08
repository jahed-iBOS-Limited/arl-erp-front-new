import React from 'react'
import { UiProvider } from '../../../_helper/uiContextHelper'
import OtherAdjustmentDebitNoteTable from './Table/TableHeader'

export default function OtherAdjustmentDebitNote({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/mngVat/otherAdjustment/debit-note/edit/${id}`)
    },
  }

  return (
    <UiProvider uIEvents={uIEvents}>
      <OtherAdjustmentDebitNoteTable></OtherAdjustmentDebitNoteTable>
    </UiProvider>
  )
}
