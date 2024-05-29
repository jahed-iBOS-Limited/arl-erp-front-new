import React from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { Redirect, Switch } from 'react-router-dom'
import findIndex from '../../_helper/_findIndex'
import NotPermittedPage from '../../_helper/notPermitted/NotPermittedPage'
import { ContentRoute } from './../../../../_metronic/layout/components/content/ContentRoute'
import PurchaseOrgAddForm from './purchase-organization/Form/addEditForm'
import { PurchaseOrganization } from './purchase-organization/index'
import RateAgreement from './rateAgreement'
import RateAgreementCreate from './rateAgreement/rateAgrementCreate'
import ItemRateUpdate from './itemRateUpdate'

export function POConfigurationPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  )

  const purchaseOrganization = userRole[findIndex(userRole, "Purchase Organization")]

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/mngProcurement/purchase-configuration"
        to="/mngProcurement/purchase-configuration/purchase-organization"
      />

      {/* Organization Name Routes */}
      <ContentRoute
        path="/mngProcurement/purchase-configuration/purchase-organization/extend/:id"
        component={
          purchaseOrganization?.isCreate ? PurchaseOrgAddForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/mngProcurement/purchase-configuration/purchase-organization/add"
        component={
          purchaseOrganization?.isCreate ? PurchaseOrgAddForm : NotPermittedPage
        }
      />

      <ContentRoute
        from="/mngProcurement/purchase-configuration/purchase-organization"
        component={PurchaseOrganization}
      />

     
      <ContentRoute
        from="/mngProcurement/purchase-configuration/item-rate-update"
        component={ItemRateUpdate}
      />

      {/* Rate Agreement */}
      <ContentRoute
        from="/mngProcurement/purchase-configuration/rate-agreement/edit/:id"
        component={
          purchaseOrganization?.isCreate ? RateAgreementCreate : NotPermittedPage
        }
      />
      <ContentRoute
        from="/mngProcurement/purchase-configuration/rate-agreement/create"
        component={
          purchaseOrganization?.isCreate ? RateAgreementCreate : NotPermittedPage
        }
      />
      <ContentRoute
        from="/mngProcurement/purchase-configuration/rate-agreement"
        component={RateAgreement}
      />

    </Switch>
  )
}
