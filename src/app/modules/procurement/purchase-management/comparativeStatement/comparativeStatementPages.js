import React from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { Redirect, Switch } from 'react-router-dom'
import { ContentRoute } from '../../../../../_metronic/layout'
import NotPermittedPage from '../../../_helper/notPermitted/NotPermittedPage'
import ShippingComparativeStatement from './cs'
import ShippingCsDetails from './cs/csDetails'
import ShippingQuotationEntry from './quotationEntry'
import ShippingQuotationCreate from './quotationEntry/createEdit'
import ShippingNegotiationCreate from './quotationEntry/negotiationCreate'
import QuotationHistoryReport from './quotationHistoryReport'
import ShippingRFQLanding from './requestForQuotation'
import ShippingRFQCreate from './requestForQuotation/createEdit/createEdit'
import SupplierUserPassword from './supplierUserPassword/inedx'
import CostEfficientSupplierList from './cs/costEfficientSupplierList'

export function ComparativeStatementShippingPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  )

  let rfqPermission = null;
  let quotationEntryPermission = null;
  let csPermisssion = null;
  let supplierCredintial = null;
  let quotationHistory = null;

  for (let i = 0; i < userRole.length; i++) {
    
   if (userRole[i]?.intFeatureId === 1152) { //For Live
    rfqPermission = userRole[i];
   }
   if (userRole[i]?.intFeatureId === 1153) { //For Live
    quotationEntryPermission = userRole[i];
   }
   if (userRole[i]?.intFeatureId === 1154) { //For Live
    csPermisssion = userRole[i];
   }
   if (userRole[i]?.intFeatureId === 1243) { //For Live
    supplierCredintial = userRole[i];
   }
   if (userRole[i]?.intFeatureId === 1265) { //For Live
    quotationHistory = userRole[i];
   }

  //  if (userRole[i]?.intFeatureId === 11141) { //For Local
  //   rfqPermission = userRole[i];
  //  }
  //  if (userRole[i]?.intFeatureId === 11142) { //For Local
  //   quotationEntryPermission = userRole[i];
  //  }
  //  if (userRole[i]?.intFeatureId === 11143) { //For Local
  //   csPermisssion = userRole[i];
  //  }
  // if (userRole[i]?.intFeatureId === 1154) { //For Live
  //   supplierCredintial = userRole[i];
  //  }

   }

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/mngProcurement/comparative-statement"
        to="/mngProcurement/comparative-statement/shipping-rfq"
      />
      {/* Request For Quotation Shipping */}

      <ContentRoute
        from="/mngProcurement/comparative-statement/shipping-cs/cs-details"
        component={csPermisssion?.isView ? ShippingCsDetails : NotPermittedPage}
      />
      <ContentRoute
        from="/mngProcurement/comparative-statement/shipping-cs"
        component={csPermisssion?.isView ? ShippingComparativeStatement : NotPermittedPage}
      />
      <ContentRoute
        from="/mngProcurement/comparative-statement/shipping-quotation-entry/negotiation-create"
        component={quotationEntryPermission?.isCreate ?ShippingNegotiationCreate : NotPermittedPage}
      />
      <ContentRoute
        from="/mngProcurement/comparative-statement/shipping-quotation-entry/create"
        component={quotationEntryPermission?.isCreate ? ShippingQuotationCreate : NotPermittedPage}
      />
      <ContentRoute
        from="/mngProcurement/comparative-statement/shipping-quotation-entry"
        component={quotationEntryPermission?.isView ? ShippingQuotationEntry : NotPermittedPage}
      />
      <ContentRoute
        from="/mngProcurement/comparative-statement/shipping-rfq/edit/:id"
        component={rfqPermission?.isEdit ? ShippingRFQCreate : NotPermittedPage}
      />
      <ContentRoute
        from="/mngProcurement/comparative-statement/shipping-rfq/create"
        component={rfqPermission?.isCreate ? ShippingRFQCreate : NotPermittedPage}
      />
      <ContentRoute
        from="/mngProcurement/comparative-statement/shipping-rfq"
        component={rfqPermission?.isView ? ShippingRFQLanding : NotPermittedPage}
      />
      <ContentRoute
        from="/mngProcurement/comparative-statement/supplier-credential"
        component={supplierCredintial?.isView ? SupplierUserPassword : NotPermittedPage }
      />
      <ContentRoute
        from="/mngProcurement/comparative-statement/quotation-history-report"
        component={quotationHistory?.isView ? QuotationHistoryReport : NotPermittedPage}
      />
      <ContentRoute
        from="/mngProcurement/comparative-statement/cost-efficient-supplierList"
        component={CostEfficientSupplierList}
      />

    </Switch>
  )
}
