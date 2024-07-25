import React from "react";
import { Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import CarrierAgentBridge from "./carrierAgentBridge/_landing/_landing";
import ChallanEntryForm from "./challanEntry/form/addEditForm";
import ChallanTable from "./challanEntry/landingPage/table";
import ConfirmBySupervisor from "./confirmBySupervisor/landingPage/index";
import G2GItemInfoCreateForm from "./g2gItemInfo/form/addEditForm";
import G2GItemInfo from "./g2gItemInfo/landingPage/table";
import GeneralLanding from "./generalInformation";
import GeneralInformationCreate from "./generalInformation/form/addEditForm";
import GhatCostInfoForm from "./ghatCostInfo/form/addEditForm";
import GhatCostInfoTable from "./ghatCostInfo/landing/_landing";
import GudamAllotmentLanding from "./gudamAllotmentEntry/_landing/_landing";
import LoadInformationCreate from "./loadingInformation/form/addEditForm";
import { LoadingLandingTable } from "./loadingInformation/landingPage/table";
import MotherVesselVoyageInfoForm from "./mohterVesselVoyageInfo/form/addEditForm";
import MotherVesselVoyageInformationTable from "./mohterVesselVoyageInfo/landingPage/table";
import TenderInformationCreateForm from "./tenderInformation/form/addEditForm";
import TenderInformationLandingTable from "./tenderInformation/landingPage/table";
import TransferInfoForm from "./transferInfo/form/addEditForm";
import TransferInfoLanding from "./transferInfo/landing/_landing";
import UnLoadingInformationForm from "./unLoadingInformation/form/addEditForm";
import UnLoadingInformationTable from "./unLoadingInformation/landingPage/table";
import VesselCostEntryForm from "./vesselCostEntry/form/addEditForm";
import VesselCostEntry from "./vesselCostEntry/landing/_landing";
import VesselOperationReport from "./vesselOperationReport/landing/form";
import VesselRevenueInfoForm from "./vesselRevenueInfo/form/addEditForm";
import VesselRevenueLanding from "./vesselRevenueInfo/landing/_landing";
import VesselShipPointChange from "./vesselShipPointChange/landing/table";
import ShippingChallanInfo from "./shippingChallanInfo/landingPage";
import ReceivePaymentInfoLanding from "./receivePaymentInfo/landing";
import DumpToTruckDeliveryLanding from "./dumpToTruckDelivery/landingPage";
import G2GSalesInvoice from "./g2gSalesInvoice";
import TenderSubmissionCreateEditForm from "./tenderSubmission/form/addEditForm";
import TenderSubmissionLanding from "./tenderSubmission/landing";
export default function AllotmentPages() {
  return (
    <Switch>
      <ContentRoute
        path="/vessel-management/allotment/generalinformation/:type/:id"
        component={GeneralInformationCreate}
      />
      <ContentRoute
        path="/vessel-management/allotment/generalinformation/Create"
        component={GeneralInformationCreate}
      />
      <ContentRoute
        path="/vessel-management/allotment/generalinformation"
        component={GeneralLanding}
      />
      <ContentRoute
        path="/vessel-management/allotment/loadinginformation/:type/:id"
        component={LoadInformationCreate}
      />
      <ContentRoute
        path="/vessel-management/allotment/loadinginformation/Create"
        component={LoadInformationCreate}
      />
      <ContentRoute
        path="/vessel-management/allotment/loadinginformation"
        component={LoadingLandingTable}
      />
      <ContentRoute
        path="/vessel-management/allotment/unloadinginformation/:type/:id"
        component={UnLoadingInformationForm}
      />
      <ContentRoute
        path="/vessel-management/allotment/unloadinginformation/create"
        component={UnLoadingInformationForm}
      />
      <ContentRoute
        path="/vessel-management/allotment/unloadinginformation"
        component={UnLoadingInformationTable}
      />
      <ContentRoute
        path="/vessel-management/allotment/challanentry/:type/:id"
        component={ChallanEntryForm}
      />
      <ContentRoute
        path="/vessel-management/allotment/challanentry/entry"
        component={ChallanEntryForm}
      />
      <ContentRoute
        path="/vessel-management/allotment/challanentry"
        component={ChallanTable}
      />
      <ContentRoute
        path="/vessel-management/allotment/vesseloperationrpt"
        component={VesselOperationReport}
      />
      <ContentRoute
        path="/vessel-management/allotment/mothervesselvoyageinfo/:type/:id"
        component={MotherVesselVoyageInfoForm}
      />
      <ContentRoute
        path="/vessel-management/allotment/mothervesselvoyageinfo/entry"
        component={MotherVesselVoyageInfoForm}
      />
      <ContentRoute
        path="/vessel-management/allotment/mothervesselvoyageinfo"
        component={MotherVesselVoyageInformationTable}
      />

      {/* Tender Submission */}

      <ContentRoute
        path="/vessel-management/allotment/tendersubmission/entry"
        component={TenderSubmissionCreateEditForm}
      />

      <ContentRoute
        path="/vessel-management/allotment/tendersubmission"
        component={TenderSubmissionLanding}
      />
      {/* Tender Information */}
      <ContentRoute
        path="/vessel-management/allotment/tenderinformation/entry"
        component={TenderInformationCreateForm}
      />
      <ContentRoute
        path="/vessel-management/allotment/tenderinformation/:type/:id"
        component={TenderInformationCreateForm}
      />
      <ContentRoute
        path="/vessel-management/allotment/tenderinformation"
        component={TenderInformationLandingTable}
      />

      {/* g2g item info  */}
      <ContentRoute
        path="/vessel-management/allotment/g2giteminfo/entry"
        component={G2GItemInfoCreateForm}
      />
      <ContentRoute
        path="/vessel-management/allotment/g2giteminfo/:type/:id"
        component={G2GItemInfoCreateForm}
      />
      <ContentRoute
        path="/vessel-management/allotment/g2giteminfo"
        component={G2GItemInfo}
      />
      <ContentRoute
        path="/vessel-management/allotment/gudamallotmententry"
        component={GudamAllotmentLanding}
      />
      <ContentRoute
        path="/vessel-management/allotment/confirmbysupervisor"
        component={ConfirmBySupervisor}
      />

      <ContentRoute
        path="/vessel-management/allotment/vesselshippointchange"
        component={VesselShipPointChange}
      />
      <ContentRoute
        path="/vessel-management/allotment/vesselrevenueinfo/:type/:id"
        component={VesselRevenueInfoForm}
      />
      <ContentRoute
        path="/vessel-management/allotment/vesselrevenueinfo"
        // working well but unnecessary component
        component={VesselRevenueLanding}
      />

      <ContentRoute
        path="/vessel-management/allotment/transferInfo/create"
        component={TransferInfoForm}
      />
      <ContentRoute
        path="/vessel-management/allotment/transferInfo"
        component={TransferInfoLanding}
      />
      <ContentRoute
        path="/vessel-management/allotment/carrieragentbridge"
        component={CarrierAgentBridge}
      />
      <ContentRoute
        path="/vessel-management/allotment/vesselcostentry/:type/:id"
        component={VesselCostEntryForm}
      />
      <ContentRoute
        path="/vessel-management/allotment/vesselcostentry"
        component={VesselCostEntry}
      />

      <ContentRoute
        path="/vessel-management/allotment/ghatcostinfo/:type/:id"
        component={GhatCostInfoForm}
      />
      <ContentRoute
        path="/vessel-management/allotment/ghatcostinfo/create"
        component={GhatCostInfoForm}
      />
      <ContentRoute
        path="/vessel-management/allotment/ghatcostinfo"
        component={GhatCostInfoTable}
      />

      <ContentRoute
        path="/vessel-management/allotment/shippingchallaninfo"
        component={ShippingChallanInfo}
      />

      <ContentRoute
        path="/vessel-management/allotment/receivepaymentinfo"
        component={ReceivePaymentInfoLanding}
      />

      <ContentRoute
        path="/vessel-management/allotment/dumptotruckdelivery"
        component={DumpToTruckDeliveryLanding}
      />

      <ContentRoute
        path="/vessel-management/allotment/g2gsalesinvoice"
        component={G2GSalesInvoice}
      />
    </Switch>
  );
}
