import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import findIndex from "../../_helper/_findIndex";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import ApprovebillregisterLanding from "./approvebillregister/index";
import BillregisterCreate from "./billregister/billCreate/index";
import BillregisterLanding from "./billregister/index";
import ClearPurchaseInvoiceLanding from "./clearPurchaseInvoice/table";
import ClearPurchaseInvoiceViewForm from "./clearPurchaseInvoice/view/viewForm";
import ClearSalesInvoiceLanding from "./clearSalesInvoice/Table";
import CustomerSalesInvoice from "./customerSalesInvoice";
import PaymentrequsetLanding from "./paymentRequset/index";
import PurchaseInvoiceForm from "./purchaseInvoice/Form/addEditForm";
import PurchaseInvoice from "./purchaseInvoice/Table";
import ViewPurchaseInvoiceForm from "./purchaseInvoice/view/addEditForm";
// import SalesInvoiceLanding from "../salesInvoiceVSpayment/LandingPage/tableHeader";
import SalesInvoiceVSPaymentCreate from "../salesInvoiceVSpayment/Form/addEditForm";
import SalesInvoiceVSPaymentLanding from "../salesInvoiceVSpayment/LandingPage/tableHeader";
import InvoiceWisePaymentLanding from "./invoiceWisePayment/InvoiceWisePaymentLanding";
import PartnerWisePaymentSummaryLanding from "./invoiceWisePayment/PartnerWisePaymentSummaryLanding";
import MoneyReceiptSubmitForm from "./moneyReceiptSubmit/form/addEditForm";
import MoneyReceiptSubmitLandingTable from "./moneyReceiptSubmit/landingPage/table";
// import SalesInvoiceLanding from "./salesInvoice";
// import AddEditForm from "./salesInvoice/Form/addEditForm";
import ShippingBillregisterLanding from "./shippingBillRegister";
import ShippingSupplerInvoiceForm from "./shippingBillRegister/shippingInvoice/addEditForm";
import SalesInvoiceForm from "./salesInvoice/formNew/addEditForm";
import SalesInvoiceLandingNew from "./salesInvoice/landing";
// import OthersBill from "./othersBill/index"
// import OthersBillCreateForm from "./othersBill/Form/addEditForm"
export function InvoiceManagementSystemPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const purchaseInvoicePermission =
    userRole[findIndex(userRole, "Purchase Invoice")];
  const clearPurchaseInvoicePermission =
    userRole[findIndex(userRole, "Clear Purchase Invoice")];
  // const customerSalesInvoicePermission = userRole[21];
  const approveBillRegister = userRole.filter(
    (item) => item?.strFeatureName === "Approve Bill Register"
  );

  const billRegister = userRole.filter((item) => item?.intFeatureId === 907);

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/financial-management/invoicemanagement-system"
        to="/financial-management/invoicemanagement-system/customerSalesInvoice"
      />

      <ContentRoute
        from="/financial-management/invoicemanagement-system/customerSalesInvoice"
        component={CustomerSalesInvoice}
      />

      <ContentRoute
        from="/financial-management/invoicemanagement-system/customerSalesInvoice"
        component={CustomerSalesInvoice}
      />

      {/* Purchase Invoice */}
      <ContentRoute
        from="/financial-management/invoicemanagement-system/purchaseinvoice/view/:id"
        component={
          purchaseInvoicePermission?.isView
            ? ViewPurchaseInvoiceForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/financial-management/invoicemanagement-system/purchaseinvoice/edit/:id"
        component={
          purchaseInvoicePermission?.isEdit
            ? PurchaseInvoiceForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/financial-management/invoicemanagement-system/purchaseinvoice/add"
        component={
          purchaseInvoicePermission?.isCreate
            ? PurchaseInvoiceForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/financial-management/invoicemanagement-system/purchaseinvoice"
        component={PurchaseInvoice}
      />
      {/* Clear Sales Invoice routes */}
      <ContentRoute
        from="/financial-management/invoicemanagement-system/clearsalesinvoice"
        component={ClearSalesInvoiceLanding}
      />

      {/* Clear purchase invoice */}
      <ContentRoute
        from="/financial-management/invoicemanagement-system/clearpurchaseinvoice/view/:id/:supplierId"
        component={
          clearPurchaseInvoicePermission?.isView
            ? ClearPurchaseInvoiceViewForm
            : NotPermittedPage
        }
      />

      <ContentRoute
        from="/financial-management/invoicemanagement-system/clearpurchaseinvoice"
        component={ClearPurchaseInvoiceLanding}
      />
      {/* billregister routes */}
      <ContentRoute
        from="/financial-management/invoicemanagement-system/billregister/create"
        component={
          billRegister?.[0]?.isCreate ? BillregisterCreate : NotPermittedPage
        }
      />
      <ContentRoute
        from="/financial-management/invoicemanagement-system/billregister"
        component={
          billRegister?.[0]?.isView ? BillregisterLanding : NotPermittedPage
        }
      />

      {/* <ContentRoute
        from="/financial-management/invoicemanagement-system/othersBill/create"
        component={OthersBillCreateForm}
      />
      <ContentRoute
        from="/financial-management/invoicemanagement-system/othersBill"
        component={OthersBill}
      /> */}

      {/* Payment Request
       */}
      <ContentRoute
        from="/financial-management/invoicemanagement-system/paymentrequset"
        component={PaymentrequsetLanding}
      />

      {/*approve bill register routes
       */}
      <ContentRoute
        from="/financial-management/invoicemanagement-system/approvebillregister"
        component={
          approveBillRegister[0]?.isCreate
            ? ApprovebillregisterLanding
            : NotPermittedPage
        }
      />

      {/* sales invoice routes*/}

      <ContentRoute
        from="/financial-management/invoicemanagement-system/salesInvoice/create"
        // component={AddEditForm}
        component={SalesInvoiceForm}
      />
      <ContentRoute
        from="/financial-management/invoicemanagement-system/salesinvoicevspayment/Create"
        component={SalesInvoiceVSPaymentCreate}
      />
      <ContentRoute
        from="/financial-management/invoicemanagement-system/salesinvoicevspayment"
        component={SalesInvoiceVSPaymentLanding}
      />
      <ContentRoute
        from="/financial-management/invoicemanagement-system/salesInvoice"
        // component={SalesInvoiceLanding}
        component={SalesInvoiceLandingNew}
      />
      <ContentRoute
        from="/financial-management/invoicemanagement-system/shippingInvoice/create"
        component={ShippingSupplerInvoiceForm}
      />
      <ContentRoute
        from="/financial-management/invoicemanagement-system/shippingInvoice"
        component={ShippingBillregisterLanding}
      />
      <ContentRoute
        from="/financial-management/invoicemanagement-system/moneyreceiptsubmit/collection"
        component={MoneyReceiptSubmitForm}
      />
      <ContentRoute
        from="/financial-management/invoicemanagement-system/moneyreceiptsubmit"
        component={MoneyReceiptSubmitLandingTable}
      />
      <ContentRoute
        from="/financial-management/invoicemanagement-system/InvoiceWisePayment/individualReport"
        component={InvoiceWisePaymentLanding}
      />
      <ContentRoute
        from="/financial-management/invoicemanagement-system/InvoiceWisePayment"
        component={PartnerWisePaymentSummaryLanding}
      />
    </Switch>
  );
}
