import BunkerManagement from "./modules/chartering/operation/bunkerManagement/create";
import DeadWeightCreate from "./modules/chartering/operation/deadWeight/create";
import CreateDischargePort from "./modules/chartering/operation/dischargePort/create";
import EDPALoadPortCreate from "./modules/chartering/operation/edpaLoadPort/create";
import CreateonHireBunkerAndContionalSurvey from "./modules/chartering/operation/onHireBunkerAndContionalSurvey/create";
import VesselNominationAcceptance from "./modules/chartering/operation/vesselNominationAcceptance/create";

export const publicRouteList = [
  {
    path: "/chartering/operation/vesselNominationAcceptance/accept",
    component: VesselNominationAcceptance,
    exact: true,
  },
  {
    path: "/chartering/operation/bunkerManagement/create",
    component: BunkerManagement,
    exact: true,
  },
  {
    path: "/chartering/operation/epdaLoadPort/create",
    component: EDPALoadPortCreate,
    exact: true,
  },
  {
    path: "/chartering/operation/pre-stowagePlanning/create",
    component: DeadWeightCreate,
    exact: true,
  },
  {
    path: "/chartering/operation/onHireBunkerAndContionalSurvey/create",
    component: CreateonHireBunkerAndContionalSurvey,
    exact: true,
  },
  {
    path: "/chartering/operation/dischargePortDepartureDocuments/create",
    component: CreateDischargePort,
    exact: true,
  },
];
