import BunkerManagement from "./modules/chartering/operation/bunkerManagement/create";
import DeadWeightCreate from "./modules/chartering/operation/deadWeight/create";
import CreateDischargePort from "./modules/chartering/operation/dischargePort/create";
import EDPALoadPortCreate from "./modules/chartering/operation/edpaLoadPort/create";
import CreateonHireBunkerAndContionalSurvey from "./modules/chartering/operation/onHireBunkerAndContionalSurvey/create";
import VesselNominationAcceptanceCreate from "./modules/chartering/operation/vesselNominationAcceptance/create";

export const publicRouteList = [
  {
    path:
      "/chartering/operation/vesselNominationAcceptance/accept/:paramId/:paramCode",
    component: VesselNominationAcceptanceCreate,
    exact: true,
  },
  {
    path: "/chartering/operation/bunkerManagement/create/:paramId/:paramCode",
    component: BunkerManagement,
    exact: true,
  },
  {
    path: "/chartering/operation/epdaLoadPort/create/:paramId/:paramCode",
    component: EDPALoadPortCreate,
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
];
