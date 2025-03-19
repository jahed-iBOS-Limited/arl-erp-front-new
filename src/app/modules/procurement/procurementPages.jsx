import React from 'react'
import { Redirect, Switch } from 'react-router-dom'
import { PurchasePages } from './purchase-management/purchasePages'
import { ContentRoute } from '../../../_metronic/layout'
import { POConfigurationPages } from './configuration/configurationPages'
import { ReportsPages } from './reports/reportsPages'
import { ComparativeStatementShippingPages } from './purchase-management/comparativeStatement/comparativeStatementPages'

export function ProcurementPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/procurement-management"
        to="/mngProcurement/purchase-management/purchase-request"
      />
      <ContentRoute
        path="/mngProcurement/purchase-management"
        component={PurchasePages}
      />
      <ContentRoute
        path="/mngProcurement/comparative-statement"
        component={ComparativeStatementShippingPages}
      />
      <ContentRoute
        path="/mngProcurement/purchase-configuration"
        component={POConfigurationPages}
      />

    {/* report */}
    <ContentRoute
        path="/mngProcurement/report"
        component={ReportsPages}
      />



    </Switch>
  )
}
export default ProcurementPages
