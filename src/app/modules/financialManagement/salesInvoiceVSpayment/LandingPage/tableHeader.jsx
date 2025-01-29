import React from 'react'
import { ITable } from '../../../_helper/_table'
import { LandingTableRow } from './tableRow'

function SalesInvoiceVSPaymentLanding() {
  return (
    <ITable
    link="/financial-management/invoicemanagement-system/salesInvoice/create"
    title="Sales Invoice Vs Payment"
  >
   <LandingTableRow/>
  </ITable>
  )
}

export default SalesInvoiceVSPaymentLanding