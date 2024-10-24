// import DeadWeightCreate from "./modules/chartering/operation/deadWeight/create";
// import CreateDischargePort from "./modules/chartering/operation/dischargePort/create";
// import EDPALoadPortCreate from "./modules/chartering/operation/edpaLoadPort/create";
// import EDPADischargePortCreate from "./modules/chartering/operation/epdaDischargePort/create";
// import CreateonHireBunkerAndContionalSurvey from "./modules/chartering/operation/onHireBunkerAndContionalSurvey/create";
// import VesselNominationAcceptanceCreate from "./modules/chartering/operation/vesselNominationAcceptance/create";

import EDPALoadPortCreate from "./modules/shippingOperation/epdaManagement/loadPort/create";
import CreateonHireBunkerAndContionalSurvey from "./modules/shippingOperation/hireBunkerAndContionalSurvey/onHireBunkerACS/create";
import VesselNominationAcceptanceCreate from "./modules/shippingOperation/vesselNomination/vesselNominationResponse/create";
import DeadWeightCreate from "./modules/shippingOperation/deadWeightPreStowagePlanning/deadWeightPreStowagePlanningChild/create";
import CreateDischargePort from "./modules/shippingOperation/departureDocuments/dischargePort/create";
import EDPADischargePortCreate from "./modules/shippingOperation/epdaManagement/dischargePort/create";
import CreateLoadPort from "./modules/shippingOperation/departureDocuments/loadPort/create";
import SuccessMessageComponent from "./modules/publicRouteComponents/success";
import ErrorMessageComponent from "./modules/publicRouteComponents/error";

export const publicRouteList = [
  {
    path:
      "/chartering/operation/vesselNominationAcceptance/accept/:paramId/:paramCode",
    component: VesselNominationAcceptanceCreate,
    exact: true,
  },
  {
    path: "/chartering/operation/epdaLoadPort/create/:paramId/:paramCode",
    component: EDPALoadPortCreate,
    exact: true,
  },
  {
    path: "/chartering/operation/epdaDischargePort/create/:paramId/:paramCode",
    component: EDPADischargePortCreate,
    exact: true,
  },
  {
    path:
      "/chartering/operation/pre-stowagePlanning/create/:paramId/:paramCode",
    component: DeadWeightCreate,
    exact: true,
  },
  {
    path:
      "/chartering/operation/onHireBunkerAndContionalSurvey/create/:paramId/:paramCode",
    component: CreateonHireBunkerAndContionalSurvey,
    exact: true,
  },
  {
    path:
      "/chartering/operation/dischargePortDepartureDocuments/create/:paramId/:paramCode",
    component: CreateDischargePort,
    exact: true,
  },
  {
    path:
      "/chartering/operation/loadPortDepartureDocuments/create/:paramId/:paramCode",
    component: CreateLoadPort,
    exact: true,
  },
  {
    path: "/success",
    component: SuccessMessageComponent,
    exact: true,
  },
  {
    path: "/error",
    component: ErrorMessageComponent,
    exact: true,
  },
];
