import React from 'react'
import { PurchaseOrgTable } from './Table/tableHeader'
import { UiProvider } from '../../../_helper/uiContextHelper'
export function PurchaseOrganization({ history }) {
  const uIEvents = {
    openExtendPage: (id) => {
      history.push(
        `/mngProcurement/purchase-configuration/purchase-organization/extend/${id}`
      )
    },
  }
  return (
    <UiProvider uIEvents={uIEvents}>
      <PurchaseOrgTable />
    </UiProvider>
  )
}
