import React from 'react'
import { UiProvider } from '../../../_helper/uiContextHelper'
import { BusinessUnitTaxTable } from './Table/tableHeader'

function BusinessUnitTaxLanding({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/mngVat/cnfg-vat/buTax/edit/${id}`)
    },
    openViewDialog: (id) => {
      history.push(`/mngVat/cnfg-vat/buTax/view/${id}`)
    },
  }

  return (
    <UiProvider uIEvents={uIEvents}>
      <BusinessUnitTaxTable />
    </UiProvider>
  )
}

export default BusinessUnitTaxLanding
