import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import findIndex from "./../../_helper/_findIndex";
import NotPermittedPage from "./../../_helper/notPermitted/NotPermittedPage";
import InformationSectionLanding from "./informationSection";
import InformationSectionCreateForm from "./informationSection/Form/addEditForm";
import InformationSetupLanding from "./informationSetup";
import InformationSetupForm from "./informationSetup/Form/addEditForm";
import MarketShareEntryForm from "./marketShareEntry/form/addEditForm";
import MarketShareEntryLandingPage from "./marketShareEntry/landingPage/form";
import MarketShareReport from "./marketShareReport/landing/form";
import PartnerProductAllocationLcInfoForm from "./partnerAllocationLcInfo/form/addEditForm";
import PartnerProductAllocationLcInfo from "./partnerAllocationLcInfo/landing/table";
import PartnerBasicInfo from "./partnerBasicInfo";
import PartnerBulkUpload from "./partnerBasicInfo/partnerBulkUpload/partnerBulkUpload";
import PartnerAddForm from "./partnerBasicInfo/partnerCreate/partnerAddForm";
import PartnerView from "./partnerBasicInfo/partnerView/partnerView";
import MainCollapsePanel from "./partnerBasicInfo/patnerEdit/mainCollapse";
import PartnerCheckSubmitForCement from "./partnerCheckSubmit/forCement/form/addEditForm";
import PartnerCheckSubmitTableForCement from "./partnerCheckSubmit/forCement/landing/table";
import ExportPaymentPostingForm from "./partnerCheckSubmit/foreignForm/addEditForm";
import PartnerCheckSubmitForm from "./partnerCheckSubmit/form/addEditForm";
import PartnerCheckSubmitLanding from "./partnerCheckSubmit/landing";
import PartnerInformation from "./partnerInformation";
import PartnerInformationCollapsePanel from "./partnerInformation/patnerEdit/mainCollapse";
import PartnerOverDueRequestForm from "./partnerOverDueRequest/form/addEditForm";
import PartnerOverDueRequestTable from "./partnerOverDueRequest/landing/table";
import PartnerPriceAndLimitRequestForm from "./partnerPriceNLimitRequest/form/addEditForm";
import PartnerPriceAndLimitRequestTable from "./partnerPriceNLimitRequest/landing/table";
import PartnerProductAllocationForm from "./partnerProductAllocation/form/addEditForm";
import PartnerProductAllocation from "./partnerProductAllocation/landing/table";
import { PartnerTerritoryInformation } from "./partnerTerritoryInfo/landing/table";
import PartnerChequeInfo from "./partnerchequeinfo/landing/form";
import ShipToPartnerAnalysisReport from "./shipToPartnerAnalysisReport/table";
import { ShipToPartnerInfoTable } from "./shipToPartnerInfo/landing/table";
import { ShipToPartnerTransfer } from "./shipToPartnerTransfer/landing/table";
import ShippingPointnTransportRate from "./shippingPointnTransportrate";
import BusinessPartnerGroupLanding from "./businessPartnerGroup/landing";
import BusinessPartnerGroupForm from "./businessPartnerGroup/form/addEditForm";
import SalesForceBenefitAnalysis from "./salesForceBenefitAlalysis";
import PartnerRegApproval from "./partnerRegistrationApproval";
import CreateApprovePartner from "./partnerRegistrationApproval/CreateApprovePartner";
import HomeBuildersInfoEntryForm from "./homeBuildersInfo/form/addEditForm";
import HomeBuildersInfoLanding from "./homeBuildersInfo/landing";

export function PartnerPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const partnerProfilePermission =
    userRole[findIndex(userRole, "Partner Profile")];

  let productionAllocation = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 885) {
      productionAllocation = userRole[i];
    }
  }
  let supplierPermission = null;
  let customerPermissions = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1446) {
      supplierPermission = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1447) {
      customerPermissions = userRole[i];
    }
  }
  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/config/partner-management"
        to="/config/partner-management/partner-basic-info"
      />

      <ContentRoute
        path="/config/partner-management/partner-basic-info/bulk-upload"
        component={
          partnerProfilePermission?.isCreate
            ? PartnerBulkUpload
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/config/partner-management/partner-basic-info/add"
        component={
          partnerProfilePermission?.isCreate ? PartnerAddForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/config/partner-management/partner-registration-approval/create/:id"
        component={CreateApprovePartner}
      />
      <ContentRoute
        path="/config/partner-management/partner-registration-approval"
        component={
          (customerPermissions && customerPermissions?.isView) ||
          (supplierPermission && supplierPermission?.isView)
            ? PartnerRegApproval
            : NotPermittedPage
        }
      />

      <ContentRoute
        path="/config/partner-management/partner-basic-info/edit/:id"
        component={
          partnerProfilePermission?.isEdit
            ? MainCollapsePanel
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/config/partner-management/partner-basic-info/view/:id"
        component={PartnerView}
      />

      <ContentRoute
        from="/config/partner-management/partner-basic-info"
        component={PartnerBasicInfo}
      />

      <ContentRoute
        path="/config/partner-management/partner-info-section/add"
        component={InformationSectionCreateForm}
      />

      <ContentRoute
        path="/config/partner-management/partner-info-section/edit/:id"
        component={InformationSectionCreateForm}
      />

      <ContentRoute
        from="/config/partner-management/partner-info-section"
        component={InformationSectionLanding}
      />

      <ContentRoute
        path="/config/partner-management/partner-info-setup/add"
        component={InformationSetupForm}
      />

      <ContentRoute
        path="/config/partner-management/partner-info-setup/edit/:id"
        component={InformationSetupForm}
      />

      <ContentRoute
        from="/config/partner-management/partner-info-setup"
        component={InformationSetupLanding}
      />

      <ContentRoute
        path="/config/partner-management/partner-other-info/edit/:id"
        component={PartnerInformationCollapsePanel}
      />

      <ContentRoute
        from="/config/partner-management/partner-other-info"
        component={PartnerInformation}
      />
      {/* Partner Product Allocation */}
      <ContentRoute
        from="/config/partner-management/partner-prod-allocation/:type/:id"
        component={PartnerProductAllocationForm}
      />
      <ContentRoute
        from="/config/partner-management/partner-prod-allocation/add"
        component={
          productionAllocation?.isCreate
            ? PartnerProductAllocationForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/config/partner-management/partner-prod-allocation"
        component={
          productionAllocation?.isView
            ? PartnerProductAllocation
            : NotPermittedPage
        }
      />

      {/* Partner Allocation LC Information */}
      <ContentRoute
        from="/config/partner-management/prod-allocation-lcinfo/view/:viewId"
        component={PartnerProductAllocationLcInfoForm}
      />
      <ContentRoute
        from="/config/partner-management/prod-allocation-lcinfo/edit/:id"
        component={PartnerProductAllocationLcInfoForm}
      />
      <ContentRoute
        from="/config/partner-management/prod-allocation-lcinfo/create"
        component={PartnerProductAllocationLcInfoForm}
      />
      <ContentRoute
        from="/config/partner-management/prod-allocation-lcinfo"
        component={PartnerProductAllocationLcInfo}
      />
      <ContentRoute
        from="/config/partner-management/partnerTerritoryInfo"
        component={PartnerTerritoryInformation}
      />

      {/* Ship to partner info */}
      <ContentRoute
        from="/config/partner-management/ShipToPartnerInfo"
        component={ShipToPartnerInfoTable}
      />

      {/* Ship to partner transfer */}
      <ContentRoute
        from="/config/partner-management/ShipToPartnertransfer"
        component={ShipToPartnerTransfer}
      />

      <ContentRoute
        from="/config/partner-management/partneroverduerequest/create"
        component={PartnerOverDueRequestForm}
      />
      <ContentRoute
        from="/config/partner-management/partneroverduerequest"
        component={PartnerOverDueRequestTable}
      />
      <ContentRoute
        from="/config/partner-management/partnerpricenlimitrequest/:type/:id"
        component={PartnerPriceAndLimitRequestForm}
      />
      <ContentRoute
        from="/config/partner-management/partnerpricenlimitrequest/create"
        component={PartnerPriceAndLimitRequestForm}
      />
      <ContentRoute
        from="/config/partner-management/partnerpricenlimitrequest"
        component={PartnerPriceAndLimitRequestTable}
      />
      {/* Partner check submit */}
      <ContentRoute
        from="/config/partner-management/partnerchecksubmit/:type/:id"
        component={
          buId === 4 ? PartnerCheckSubmitForCement : PartnerCheckSubmitForm
        }
      />
      <ContentRoute
        from="/config/partner-management/partnerchecksubmit/create"
        component={
          buId === 4 ? PartnerCheckSubmitForCement : PartnerCheckSubmitForm
        }
      />
      <ContentRoute
        from="/config/partner-management/partnerchecksubmit/export-payment-posting"
        component={ExportPaymentPostingForm}
      />
      <ContentRoute
        from="/config/partner-management/partnerchecksubmit"
        component={
          buId === 4
            ? PartnerCheckSubmitTableForCement
            : PartnerCheckSubmitLanding
        }
      />

      <ContentRoute
        from="/config/partner-management/marketshareentry/:type/:id"
        component={MarketShareEntryForm}
      />
      <ContentRoute
        from="/config/partner-management/marketshareentry/entry"
        component={MarketShareEntryForm}
      />
      <ContentRoute
        from="/config/partner-management/marketshareentry"
        component={MarketShareEntryLandingPage}
      />

      <ContentRoute
        from="/config/partner-management/marketsharereport"
        component={MarketShareReport}
      />
      <ContentRoute
        from="/config/partner-management/ShipToPartneranalysis"
        component={ShipToPartnerAnalysisReport}
      />

      <ContentRoute
        from="/config/partner-management/Shippingpointntransportrate"
        component={ShippingPointnTransportRate}
      />

      <ContentRoute
        from="/config/partner-management/partnerchequeinfo"
        component={PartnerChequeInfo}
      />

      <ContentRoute
        from="/config/partner-management/businesspartnergroup/create"
        component={BusinessPartnerGroupForm}
      />
      <ContentRoute
        from="/config/partner-management/businesspartnergroup"
        component={BusinessPartnerGroupLanding}
      />

      <ContentRoute
        from="/config/partner-management/Salesforcebenefitanalysis"
        component={SalesForceBenefitAnalysis}
      />

      <ContentRoute
        from="/config/partner-management/HomeBuildersInfo/entry"
        component={HomeBuildersInfoEntryForm}
      />
      <ContentRoute
        from="/config/partner-management/HomeBuildersInfo"
        component={HomeBuildersInfoLanding}
      />
    </Switch>
  );
}
