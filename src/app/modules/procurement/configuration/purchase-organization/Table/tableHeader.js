import React from 'react'
import { TableRow } from './tableRow'
import ICustomCard from '../../../../_helper/_customCard'
import { useHistory } from 'react-router-dom'

export function PurchaseOrgTable() {
  const history = useHistory()

  return (
    <ICustomCard
      title="Purchase Organization"
      createHandler={() =>
        history.push(
          `/mngProcurement/purchase-configuration/purchase-organization/add`
        )
      }
    >
      <TableRow />
    </ICustomCard>
  )
}
