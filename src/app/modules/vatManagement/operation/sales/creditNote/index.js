import React from 'react'
import { UiProvider } from '../../../../_helper/uiContextHelper'
import { CreditNoteTable } from './Table/tableHeader'

function CreditNoteLanding({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/operation/sales/credit-note/edit/${id}`)
    },
  }

  return (
    <UiProvider uIEvents={uIEvents}>
      <CreditNoteTable />
    </UiProvider>
  )
}
export default CreditNoteLanding
