import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import PartnerBasicInfo from "./partnerBasicInfo";
import { ContentRoute } from "../../../../_metronic/layout";
import PartnerAddForm from "./partnerBasicInfo/partnerCreate/partnerAddForm";
import MainCollapsePanel from "./partnerBasicInfo/patnerEdit/mainCollapse";
import InformationSectionLanding from "./informationSection";
import InformationSectionCreateForm from "./informationSection/Form/addEditForm";
import InformationSetupLanding from "./informationSetup";
import InformationSetupForm from "./informationSetup/Form/addEditForm";
import PartnerInformation from "./partnerInformation";
import PartnerInformationCollapsePanel from "./partnerInformation/patnerEdit/mainCollapse";
import findIndex from "./../../_helper/_findIndex";
import NotPermittedPage from "./../../_helper/notPermitted/NotPermittedPage";
import PartnerProductAllocation from "./partnerProductAllocation/landing/table";
import PartnerProductAllocationForm from "./partnerProductAllocation/form/addEditForm";
import PartnerProductAllocationLcInfo from "./partnerAllocationLcInfo/landing/table";
import PartnerProductAllocationLcInfoForm from "./partnerAllocationLcInfo/form/addEditForm";
import { PartnerTerritoryInformation } from "./partnerTerritoryInfo/landing/table";
import { ShipToPartnerInfoTable } from "./shipToPartnerInfo/landing/table";
import { ShipToPartnerTransfer } from "./shipToPartnerTransfer/landing/table";
import PartnerOverDueRequestTable from "./partnerOverDueRequest/landing/table";
import PartnerOverDueRequestForm from "./partnerOverDueRequest/form/addEditForm";
import PartnerPriceAndLimitRequestTable from "./partnerPriceNLimitRequest/landing/table";
import PartnerPriceAndLimitRequestForm from "./partnerPriceNLimitRequest/form/addEditForm";
import PartnerCheckSubmitForm from "./partnerCheckSubmit/form/addEditForm";
import MarketShareEntryLandingPage from "./marketShareEntry/landingPage/form";
import MarketShareEntryForm from "./marketShareEntry/form/addEditForm";
import MarketShareReport from "./marketShareReport/landing/form";
import ShipToPartnerAnalysisReport from "./shipToPartnerAnalysisReport/table";
import PartnerCheckSubmitForCement from "./partnerCheckSubmit/forCement/form/addEditForm";
import PartnerCheckSubmitTableForCement from "./partnerCheckSubmit/forCement/landing/table";
import PartnerChequeInfo from "./partnerchequeinfo/landing/form";
import ShippingPointnTransportRate from "./shippingPointnTransportrate";
import ExportPaymentPostingForm from "./partnerCheckSubmit/foreignForm/addEditForm";
import PartnerCheckSubmitLanding from "./partnerCheckSubmit/landing";

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
        path="/config/partner-management/partner-basic-info/add"
        component={
          partnerProfilePermission?.isCreate ? PartnerAddForm : NotPermittedPage
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
    </Switch>
  );
}
