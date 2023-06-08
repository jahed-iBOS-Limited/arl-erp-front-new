import React from 'react'
import { VatItemTable } from './Table/tableHeader'
import { UiProvider } from './../../../../_helper/uiContextHelper';

function PurchaseLanding({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/operation/purchase/purchase/edit/${id}`)
    },
    openViewDialog: (id) => {
      history.push(`/operation/purchase/purchase/view/${id}`)
    },
  }

  return (
    <UiProvider uIEvents={uIEvents}>
      <VatItemTable />
    </UiProvider>
  )
}
export default PurchaseLanding
