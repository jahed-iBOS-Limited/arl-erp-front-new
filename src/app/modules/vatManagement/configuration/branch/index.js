import React from 'react'
import { useDispatch } from 'react-redux'
import { Route } from 'react-router-dom'
import { UiProvider } from '../../../_helper/uiContextHelper'
import ViewForm from './branchView/ViewModal'
import { BranchTable } from './Table/tableHeader'
import { setBranchSingleEmpty } from './_redux/Actions'

export function BranchLanding() {
  const uIEvents = {}
  const dispatch = useDispatch();
  return (
    <UiProvider uIEvents={uIEvents}>
      <Route path="/mngVat/cnfg-vat/branch/view/:id">
        {({ history, match }) => (
          <ViewForm
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              dispatch(setBranchSingleEmpty());
              history.push('/mngVat/cnfg-vat/branch')
            }}
          />
        )}
      </Route>
      <BranchTable />
    </UiProvider>
  )
}
