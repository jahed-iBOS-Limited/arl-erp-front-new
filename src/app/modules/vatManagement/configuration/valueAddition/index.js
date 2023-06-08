import React from 'react'
import { ValueAdditionTable } from './Table/tableHeader'
import { UiProvider } from '../../../_helper/uiContextHelper'

function ValueAdditionLanding({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/mngVat/cnfg-vat/value-addition/edit/${id}`)
    },
    openViewDialog: (id) => {
      history.push(`/mngVat/cnfg-vat/value-addition/view/${id}`)
    },
  }

  return (
    <UiProvider uIEvents={uIEvents}>
      <ValueAdditionTable />
    </UiProvider>
  )
}
export default ValueAdditionLanding
