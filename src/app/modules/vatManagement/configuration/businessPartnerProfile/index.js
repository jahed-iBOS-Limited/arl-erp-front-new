import React from 'react'
import { BusinessPartnerProfileTable } from './Table/tableHeader'
import { UiProvider } from '../../../_helper/uiContextHelper'

export default function BusinessPartnerProfileLanding({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/mngVat/cnfg-vat/cnfg/edit/${id}`)
    },
  }

  return (
    <UiProvider uIEvents={uIEvents}>
      <BusinessPartnerProfileTable />
    </UiProvider>
  )
}
