import React from 'react'
import { Route } from 'react-router-dom'
import { TresuaryDepositTable } from './Table/tableHeader'
import ViewForm from './View/viewModal'
function TresuaryDepositLanding() {
  return (
    <>
      <Route path="/mngVat/transaction/treasury/view/:id">
        {({ history, match }) => (
          <ViewForm
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push('/mngVat/transaction/treasury')
            }}
          />
        )}
      </Route>
      <TresuaryDepositTable />
    </>
  )
}

export default TresuaryDepositLanding
