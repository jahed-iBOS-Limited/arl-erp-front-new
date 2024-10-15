import React from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { Redirect, Switch } from 'react-router-dom'
import { ContentRoute } from '../../../../_metronic/layout'
import NotPermittedPage from '../../_helper/notPermitted/NotPermittedPage'
import findIndex from '../../_helper/_findIndex'
import PurchaseOrder from './purchaseOrder'
import { POEditFormByOrderType } from './purchaseOrder/Edit'
import { POFormByOrderType } from './purchaseOrder/Form'
import { PurchaseOrderReport } from './purchaseOrder/report/tableHeader'
import PurchaseOrderShipping from './purchaseOrderShipping'
import { POEditFormByOrderTypeShipping } from './purchaseOrderShipping/Edit'
import { POFormByOrderTypeShipping } from './purchaseOrderShipping/Form'
import { PurchaseOrderReportShipping } from './purchaseOrderShipping/report/tableHeader'
import PurchaseRequestCreateForm from './purchaseRequestNew/form/addEditForm'
import { PurchaseRequestReport } from './purchaseRequestNew/report/tableHeader'
import PurchaseRequestTable from './purchaseRequestNew/table/table'
// import RFQ from './rfq'
import CSForm from './rfq/CS/addEditForm'
// import RFQForm from './rfq/Form/addEditForm'
import QuotationForm from './rfq/QuotationEntry/addEditForm'
import { QuationEntryReport } from './rfq/report/tableHeader'
import RequestForQuotationLanding from './requestForQuotation'
import RFQCreateEdit from './requestForQuotation/createEdit'
import ErpComparativeStatementLanding from './erpComparativeStatement/quotationEntry'
import ErpQuotationEntryLanding from './erpQuotationEntry'
import AddQuotationEntry from './erpQuotationEntry/entryForm/addQuotationEntry'
import AutoPRCalculation from './autoPRCalculation'

export function PurchasePages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  )

  const purchaseRequest = userRole[findIndex(userRole, "Purchase Request")]
  const purchaseOrder = userRole[findIndex(userRole, "Purchase Order")];

  let purchaseOrderShippingPermission = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1123) {
      purchaseOrderShippingPermission = userRole[i];
    }
  }

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/mngProcurement/purchase-management"
        to="/mngProcurement/purchase-management/purchase-request"
      />

      {/* Purchase Request */}
      <ContentRoute
        from="/mngProcurement/purchase-management/purchase-request/edit/:prId"
        component={
          purchaseRequest?.isEdit ? PurchaseRequestCreateForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/mngProcurement/purchase-management/purchase-request/view/:prId/:type"
        component={
          purchaseRequest?.isView ? PurchaseRequestCreateForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/mngProcurement/purchase-management/purchase-request/create"
        component={
          purchaseRequest?.isCreate
            ? PurchaseRequestCreateForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/mngProcurement/purchase-management/purchase-request/report/:prId"
        component={
          //purchaseRequest?.isView ? 
          PurchaseRequestReport
          //: NotPermittedPage
        }
      />
      <ContentRoute
        from="/mngProcurement/purchase-management/purchase-request"
        component={PurchaseRequestTable}
      />

      {/* Purchase order Routes */}
      <ContentRoute
        from="/mngProcurement/purchase-management/purchaseorder/report/:poId/:orId"
        component={
          purchaseOrder?.isView ? PurchaseOrderReport : NotPermittedPage
        }
      />
      <ContentRoute
        from="/mngProcurement/purchase-management/purchaseorder/view/:poId/:poType"
        component={
          purchaseOrder?.isView ? POEditFormByOrderType : NotPermittedPage
        }
      />
      <ContentRoute
        from="/mngProcurement/purchase-management/purchaseorder/edit/:poId/:poType"
        component={
          purchaseOrder?.isEdit ? POEditFormByOrderType : NotPermittedPage
        }
      />
      <ContentRoute
        from="/mngProcurement/purchase-management/purchaseorder/create"
        component={
          purchaseOrder?.isCreate ? POFormByOrderType : NotPermittedPage
        }
      />

      <ContentRoute
        from="/mngProcurement/purchase-management/purchaseorder"
        component={PurchaseOrder}
      />

      {/* Purchase order Shipping Routes */}
      <ContentRoute
        from="/mngProcurement/purchase-management/shippingpurchaseorder/report/:poId/:orId"
        component={
          purchaseOrderShippingPermission?.isView ? PurchaseOrderReportShipping : NotPermittedPage
        }
      />
      <ContentRoute
        from="/mngProcurement/purchase-management/shippingpurchaseorder/view/:poId/:poType"
        component={
          purchaseOrderShippingPermission?.isView ? POEditFormByOrderTypeShipping : NotPermittedPage
        }
      />
      <ContentRoute
        from="/mngProcurement/purchase-management/shippingpurchaseorder/edit/:poId/:poType"
        component={
          purchaseOrderShippingPermission?.isEdit ? POEditFormByOrderTypeShipping : NotPermittedPage
        }
      />
      <ContentRoute
        from="/mngProcurement/purchase-management/shippingpurchaseorder/create"
        component={
          purchaseOrderShippingPermission?.isCreate ? POFormByOrderTypeShipping : NotPermittedPage
        }
      />

      <ContentRoute
        from="/mngProcurement/purchase-management/shippingpurchaseorder"
        component={purchaseOrderShippingPermission?.isView ? PurchaseOrderShipping : NotPermittedPage}
      />

      {/* Request for quotation */}
      <ContentRoute
        from="/mngProcurement/purchase-management/rfq/view/:prId"
        component={QuationEntryReport}
      />
      {/* <ContentRoute
        from="/mngProcurement/purchase-management/rfq/add"
        component={RFQForm}
      /> */}
      {/* <ContentRoute
        from="/mngProcurement/purchase-management/rfq/edit/:id"
        component={RFQForm}
      /> */}
      <ContentRoute
        from="/mngProcurement/purchase-management/rfq/quotation/:id"
        component={QuotationForm}
      />
      <ContentRoute
        from="/mngProcurement/purchase-management/rfq/cs/:id"
        component={CSForm}
      />
      {/* <ContentRoute
        from="/mngProcurement/purchase-management/rfq"
        component={RFQ}
      /> */}
      <ContentRoute
        from="/mngProcurement/purchase-management/rfq/edit/:id"
        component={RFQCreateEdit}
      />
      <ContentRoute
        from="/mngProcurement/purchase-management/rfq/create"
        component={RFQCreateEdit}
      />
      <ContentRoute
        from="/mngProcurement/purchase-management/rfq"
        component={RequestForQuotationLanding}
      />
      
      <ContentRoute
        from="/mngProcurement/purchase-management/QuotationEntry/add"
        component={AddQuotationEntry}
      />
      <ContentRoute
        from="/mngProcurement/purchase-management/QuotationEntry"
        component={ErpQuotationEntryLanding}
      />

      <ContentRoute
        from="/mngProcurement/purchase-management/AutoPRCalculation"
        component={AutoPRCalculation}
      />

      <ContentRoute
        from="/mngProcurement/purchase-management/cs"
        component={ErpComparativeStatementLanding}
      />

    </Switch>
  )
}