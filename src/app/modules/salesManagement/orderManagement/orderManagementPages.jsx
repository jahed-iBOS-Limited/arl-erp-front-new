import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import findIndex from "./../../_helper/_findIndex";
import CustomerIncentive from "./customerIncentive";
import { CustomerVisitLanding } from "./customerVisit";
import { CustomerVisitForm } from "./customerVisit/Form/addEditForm";
import DamageEntryForm from "./damageEntry/form/addEditForm";
import DamageEntryLanding from "./damageEntry/landing";
import HologramPrintLanding from "./hologramPrint/table/table";
import MonthlyCollectionPlanEntryForm from "./monthlyCollectionPlan/form/addEditForm";
import { MonthlyCollectionPlanLanding } from "./monthlyCollectionPlan/landingPage/table";
import OrdertransferLanding from "./ordertransfer/Table/index";
import PartnerAllotmentChallanForm from "./partnerAllotmentChallan/Form/addEditForm";
import PartnerAllotmentChallan from "./partnerAllotmentChallan/Table/table";
import { PGI } from "./pgi";
import PGIForm from "./pgi/Form/addEditForm";
import { SalesContract } from "./salesContract";
import SalesContactForm from "./salesContract/Form/addEditForm";
import SalesContactViewForm from "./salesContract/ViewForm/addEditForm";
import SalesIncentive from "./salesIncentive";
import SalesIncentiveForm from "./salesIncentive/addEditForm";
import { SalesOrder } from "./salesOrder";
import SalesOrderForm from "./salesOrder/Form/addEditForm";
import { salesOrderInActiveMenuPermissionAPI } from "./salesOrderInActive/helper";
import SalesOrderInActiveLanding from "./salesOrderInActive/landing/index";
import SalesOrderReportLandingPage from "./salesOrderReport/Landing";
import SalesQuotation from "./salesQuotation";
import SalesQuotationForm from "./salesQuotation/Form/addEditForm";
import SalesQuotationReadyMix from "./salesQuotationReadyMix";
import SalesQuotationReadyMixForm from "./salesQuotationReadyMix/Form/addEditForm";
import { SalesReportOMS } from "./salesReportOMS/index";
import SalesReturnForm from "./salesReturn/form/addEditForm";
import SalesReturn from "./salesReturn/landing/table";
import RecevingChallanAttachmentEntryFrom from "./recevingChallanAttachment/form/addEditForm";
import RecevingChallanAttachmentEntryLanding from "./recevingChallanAttachment/landing";

export function OrderManagementPages() {
  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let customerIncentivePermission = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1347) {
      customerIncentivePermission = userRole[i];
    }
  }

  const salesQuotation = userRole[findIndex(userRole, "Sales Quotation")];
  const salesContract = userRole[findIndex(userRole, "Sales Contract")];
  const salesOrder = userRole[findIndex(userRole, "Sales Order")];

  // Get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  /* Assign by Iftakhar Bhai (Backend) */
  const [
    salesOrderInactivePermission,
    setSalesOrderInactivePermission,
  ] = useState(false);

  useEffect(() => {
    salesOrderInActiveMenuPermissionAPI(
      profileData.userId,
      selectedBusinessUnit.value,
      setSalesOrderInactivePermission
    );
  }, [profileData.userId, selectedBusinessUnit.value]);

  return (
    <Switch>
      <Redirect
        exact={true}
        from='/sales-management/ordermanagement'
        to='/sales-management/ordermanagement/salesquotation'
      />
      <ContentRoute
        from='/sales-management/ordermanagement/salesquotation/edit/:id'
        component={
          salesQuotation?.isEdit
            ?  [175, 4].includes(selectedBusinessUnit?.value)
            ? SalesQuotationReadyMixForm
              : SalesQuotationForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from='/sales-management/ordermanagement/salesquotation/add'
        component={
          salesQuotation?.isCreate
            ? [175, 4].includes(selectedBusinessUnit?.value)
              ? SalesQuotationReadyMixForm
              : SalesQuotationForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from='/sales-management/ordermanagement/salesquotation'
        component={
          [175, 4].includes(selectedBusinessUnit?.value)
            ? SalesQuotationReadyMix
            : SalesQuotation
        }
      />

      {/* SalesContract Routes */}
      <ContentRoute
        from='/sales-management/ordermanagement/salescontract/view/:view'
        component={
          salesContract?.isView ? SalesContactViewForm : NotPermittedPage
        }
      />
      <ContentRoute
        from='/sales-management/ordermanagement/salescontract/edit/:id'
        component={salesContract?.isEdit ? SalesContactForm : NotPermittedPage}
      />
      <ContentRoute
        from='/sales-management/ordermanagement/salescontract/add'
        component={
          salesContract?.isCreate ? SalesContactForm : NotPermittedPage
        }
      />
      <ContentRoute
        from='/sales-management/ordermanagement/salescontract'
        component={SalesContract}
      />
      {/* SalesOrder Routes */}
      <ContentRoute
        from='/sales-management/ordermanagement/salesorder/edit/:id'
        component={salesOrder?.isEdit ? SalesOrderForm : NotPermittedPage}
      />
      <ContentRoute
        from='/sales-management/ordermanagement/salesorder/create'
        component={salesOrder?.isCreate ? SalesOrderForm : NotPermittedPage}
      />
      <ContentRoute
        from='/sales-management/ordermanagement/salesorder'
        component={SalesOrder}
      />

      {/* Sales Order Report Routes */}
      <ContentRoute
        from='/sales-management/ordermanagement/salesOrderReportVat/edit/:id'
        component={salesOrder?.isEdit ? SalesOrderForm : NotPermittedPage}
      />
      <ContentRoute
        from='/sales-management/ordermanagement/salesOrderReportVat/create'
        component={salesOrder?.isCreate ? SalesOrderForm : NotPermittedPage}
      />
      <ContentRoute
        from='/sales-management/ordermanagement/salesOrderReportVat'
        component={SalesOrderReportLandingPage}
      />

      {/* PGI Routes */}
      <ContentRoute
        from='/sales-management/ordermanagement/pgi/add'
        component={PGIForm}
      />
      <ContentRoute
        from='/sales-management/ordermanagement/pgi'
        component={PGI}
      />
      <ContentRoute
        from='/sales-management/ordermanagement/ordertransfer'
        component={OrdertransferLanding}
      />

      {/* Pending Order Routes */}
      {/* <ContentRoute
        from="/sales-management/ordermanagement/pendingOrder/add"
        component={PendingOrderForm}
      />
      <ContentRoute
        from="/sales-management/ordermanagement/pendingOrder"
        component={PendingOrder}
      /> */}

      {/* Partner Ledger Routes */}
      {/* <ContentRoute
        from="/sales-management/ordermanagement/partnerLedger/add"
        component={PartnerLedgerForm}
      />
      <ContentRoute
        from="/sales-management/ordermanagement/partnerLedger"
        component={PartnerLedger}
      /> */}

      {/* Sales Config Routes */}
      {/* <ContentRoute
        from="/sales-management/ordermanagement/salesConfig"
        component={SalesConfig}
      /> */}

      {/* Delivery report */}
      {/* <ContentRoute
        from="/sales-management/ordermanagement/deliveryreport"
        component={DeliveryReport}
      /> */}

      {/* Sales Details */}
      {/* <ContentRoute
        from="/sales-management/ordermanagement/salesdetails"
        component={SalesDetails}
      /> */}

      {/* Sales Order InActive */}
      <ContentRoute
        from='/sales-management/ordermanagement/salesorderInActive'
        component={
          salesOrderInactivePermission
            ? SalesOrderInActiveLanding
            : NotPermittedPage
        }
      />
      <ContentRoute
        from='/sales-management/ordermanagement/partnerAllotmentChallan/create/:allotmentId'
        component={PartnerAllotmentChallanForm}
      />
      <ContentRoute
        from='/sales-management/ordermanagement/partnerAllotmentChallan'
        component={PartnerAllotmentChallan}
      />
      <ContentRoute
        from='/sales-management/ordermanagement/salesReport'
        component={SalesReportOMS}
      />

      <ContentRoute
        from='/sales-management/ordermanagement/salesreturn/entry'
        component={SalesReturnForm}
      />
      <ContentRoute
        from='/sales-management/ordermanagement/salesreturn'
        component={SalesReturn}
      />

      <ContentRoute
        from='/sales-management/ordermanagement/damageentry/entry'
        component={DamageEntryForm}
      />
      <ContentRoute
        from='/sales-management/ordermanagement/damageentry'
        component={DamageEntryLanding}
      />

     <ContentRoute
        from='/sales-management/ordermanagement/recevingchallanattachment/entry'
        component={RecevingChallanAttachmentEntryFrom}
      />

     <ContentRoute
        from='/sales-management/ordermanagement/recevingchallanattachment'
        component={RecevingChallanAttachmentEntryLanding}
      />

      {/* Sales Order Report Routes */}
      <ContentRoute
        from='/sales-management/ordermanagement/customerVisit/edit/:id'
        component={CustomerVisitForm}
      />
      <ContentRoute
        from='/sales-management/ordermanagement/customerVisit/create'
        component={CustomerVisitForm}
      />
      <ContentRoute
        from='/sales-management/ordermanagement/customerVisit'
        component={CustomerVisitLanding}
      />

      <ContentRoute
        from='/sales-management/ordermanagement/hallogramprint'
        component={HologramPrintLanding}
      />

      <ContentRoute
        from='/sales-management/ordermanagement/MonthlyCollectionPlan/entry'
        component={MonthlyCollectionPlanEntryForm}
      />
      <ContentRoute
        from='/sales-management/ordermanagement/MonthlyCollectionPlan'
        component={MonthlyCollectionPlanLanding}
      />
      <ContentRoute
        from='/sales-management/ordermanagement/CustomerIncentive'
        component={
          customerIncentivePermission?.isView
            ? CustomerIncentive
            : NotPermittedPage
        }
      />
      <ContentRoute
        from='/sales-management/ordermanagement/salesincentive/create'
        component={SalesIncentiveForm}
      />
      <ContentRoute
        from='/sales-management/ordermanagement/salesincentive'
        component={SalesIncentive}
      />
    </Switch>
  );
}
