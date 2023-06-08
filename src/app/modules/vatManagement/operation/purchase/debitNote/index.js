import React from 'react'
import { UiProvider } from '../../../../_helper/uiContextHelper'

import SalesDebitNoteTable from './Table/TableHeader'

export default function SalesDebitNote({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/operation/purchase/debit-note/edit/${id}`)
    },
  }

  return (
    <UiProvider uIEvents={uIEvents}>
      <SalesDebitNoteTable />
    </UiProvider>
  )
}
