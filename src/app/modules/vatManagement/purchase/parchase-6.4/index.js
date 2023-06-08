import React from 'react'
import { UiProvider } from '../../../_helper/uiContextHelper'
import { VatItemTable } from './Table/tableHeader'

function PurchaseLanding({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/mngVat/cnfg-vat/vat-item/edit/${id}`)
    },
    openViewDialog: (id) => {
      history.push(`/mngVat/cnfg-vat/vat-item/view/${id}`)
    },
  }

  return (
    <UiProvider uIEvents={uIEvents}>
      <VatItemTable />
    </UiProvider>
  )
}
export default PurchaseLanding
