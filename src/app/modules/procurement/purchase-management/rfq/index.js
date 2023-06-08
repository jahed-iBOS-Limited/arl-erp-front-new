import React, { useState } from 'react'
import { ITableTwo } from '../../../_helper/_tableTwo'
import HeaderForm from './Landing/form'
import GridData from './Landing/grid'
export default function RFQ({ match }) {
  const [usersDDLdata, setUsersDDLdata] = useState('')
  return (
    <div>
      <ITableTwo
        renderProps={() => <HeaderForm setUsersDDLdata={setUsersDDLdata} />}
        title="Request for Quotation"
        viewLink="/mngProcurement/purchase-management/rfq/view"
        createLink="/mngProcurement/purchase-management/rfq/add"
        isHidden={true}
      >
        <GridData usersDDLdata={usersDDLdata} />
      </ITableTwo>
      {/* <Route path="/mngProcurement/purchase-management/rfq/view/:id">
        {({ history, match }) => (
          <ViewForm
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push('/mngProcurement/purchase-management/rfq')
            }}
          />
        )}
      </Route> */}
    </div>
  )
}
