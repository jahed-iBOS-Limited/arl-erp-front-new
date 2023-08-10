import React, { useEffect, useState } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import SalesQuotation from "./salesQuotation";
import { SalesContract } from "./salesContract";
import SalesContactForm from "./salesContract/Form/addEditForm";
import SalesQuotationForm from "./salesQuotation/Form/addEditForm";
import { PGI } from "./pgi";
import PGIForm from "./pgi/Form/addEditForm";
import { SalesOrder } from "./salesOrder";
import SalesOrderForm from "./salesOrder/Form/addEditForm";
import SalesContactViewForm from "./salesContract/ViewForm/addEditForm";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import { shallowEqual, useSelector } from "react-redux";
import OrdertransferLanding from "./ordertransfer/Table/index";
import findIndex from "./../../_helper/_findIndex";
import SalesOrderInActiveLanding from "./salesOrderInActive/landing/index";
import PartnerAllotmentChallan from "./partnerAllotmentChallan/Table/table";
import PartnerAllotmentChallanForm from "./partnerAllotmentChallan/Form/addEditForm";
import { SalesReportOMS } from "./salesReportOMS/index";
import { salesOrderInActiveMenuPermissionAPI } from "./salesOrderInActive/helper";
import SalesOrderReportLandingPage from "./salesOrderReport/Landing";
import SalesReturnForm from "./salesReturn/form/addEditForm";
import SalesReturn from "./salesReturn/landing/table";
import SalesQuotationReadyMixForm from "./salesQuotationReadyMix/Form/addEditForm";
import SalesQuotationReadyMix from "./salesQuotationReadyMix";
import { CustomerVisitForm } from "./customerVisit/Form/addEditForm";
import { CustomerVisitLanding } from "./customerVisit";
import HologramPrintLanding from "./hologramPrint/table/table";
import { MonthlyCollectionPlanLanding } from "./monthlyCollectionPlan/landingPage/table";
import MonthlyCollectionPlanEntryForm from "./monthlyCollectionPlan/form/addEditForm";

export function OrderManagementPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

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
        from="/sales-management/ordermanagement"
        to="/sales-management/ordermanagement/salesquotation"
      />
      <ContentRoute
        from="/sales-management/ordermanagement/salesquotation/edit/:id"
        component={
          salesQuotation?.isEdit
            ? selectedBusinessUnit?.value === 175
              ? SalesQuotationReadyMixForm
              : SalesQuotationForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/ordermanagement/salesquotation/add"
        component={
          salesQuotation?.isCreate
            ? selectedBusinessUnit?.value === 175
              ? SalesQuotationReadyMixForm
              : SalesQuotationForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/ordermanagement/salesquotation"
        component={
          selectedBusinessUnit?.value === 175
            ? SalesQuotationReadyMix
            : SalesQuotation
        }
      />

      {/* SalesContract Routes */}
      <ContentRoute
        from="/sales-management/ordermanagement/salescontract/view/:view"
        component={
          salesContract?.isView ? SalesContactViewForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/ordermanagement/salescontract/edit/:id"
        component={salesContract?.isEdit ? SalesContactForm : NotPermittedPage}
      />
      <ContentRoute
        from="/sales-management/ordermanagement/salescontract/add"
        component={
          salesContract?.isCreate ? SalesContactForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/ordermanagement/salescontract"
        component={SalesContract}
      />
      {/* SalesOrder Routes */}
      <ContentRoute
        from="/sales-management/ordermanagement/salesorder/edit/:id"
        component={salesOrder?.isEdit ? SalesOrderForm : NotPermittedPage}
      />
      <ContentRoute
        from="/sales-management/ordermanagement/salesorder/create"
        component={salesOrder?.isCreate ? SalesOrderForm : NotPermittedPage}
      />
      <ContentRoute
        from="/sales-management/ordermanagement/salesorder"
        component={SalesOrder}
      />

      {/* Sales Order Report Routes */}
      <ContentRoute
        from="/sales-management/ordermanagement/salesOrderReportVat/edit/:id"
        component={salesOrder?.isEdit ? SalesOrderForm : NotPermittedPage}
      />
      <ContentRoute
        from="/sales-management/ordermanagement/salesOrderReportVat/create"
        component={salesOrder?.isCreate ? SalesOrderForm : NotPermittedPage}
      />
      <ContentRoute
        from="/sales-management/ordermanagement/salesOrderReportVat"
        component={SalesOrderReportLandingPage}
      />

      {/* PGI Routes */}
      <ContentRoute
        from="/sales-management/ordermanagement/pgi/add"
        component={PGIForm}
      />
      <ContentRoute
        from="/sales-management/ordermanagement/pgi"
        component={PGI}
      />
      <ContentRoute
        from="/sales-management/ordermanagement/ordertransfer"
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
        from="/sales-management/ordermanagement/salesorderInActive"
        component={
          salesOrderInactivePermission
            ? SalesOrderInActiveLanding
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/sales-management/ordermanagement/partnerAllotmentChallan/create/:allotmentId"
        component={PartnerAllotmentChallanForm}
      />
      <ContentRoute
        from="/sales-management/ordermanagement/partnerAllotmentChallan"
        component={PartnerAllotmentChallan}
      />
      <ContentRoute
        from="/sales-management/ordermanagement/salesReport"
        component={SalesReportOMS}
      />

      <ContentRoute
        from="/sales-management/ordermanagement/salesreturn/entry"
        component={SalesReturnForm}
      />
      <ContentRoute
        from="/sales-management/ordermanagement/salesreturn"
        component={SalesReturn}
      />

      {/* Sales Order Report Routes */}
      <ContentRoute
        from="/sales-management/ordermanagement/customerVisit/edit/:id"
        component={CustomerVisitForm}
      />
      <ContentRoute
        from="/sales-management/ordermanagement/customerVisit/create"
        component={CustomerVisitForm}
      />
      <ContentRoute
        from="/sales-management/ordermanagement/customerVisit"
        component={CustomerVisitLanding}
      />

      <ContentRoute
        from="/sales-management/ordermanagement/hallogramprint"
        component={HologramPrintLanding}
      />

      <ContentRoute
        from="/sales-management/ordermanagement/MonthlyCollectionPlan/entry"
        component={MonthlyCollectionPlanEntryForm}
      />
      <ContentRoute
        from="/sales-management/ordermanagement/MonthlyCollectionPlan"
        component={MonthlyCollectionPlanLanding}
      />
    </Switch>
  );
}
