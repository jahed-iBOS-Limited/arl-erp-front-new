import DeadWeightCreate from "./modules/chartering/operation/deadWeight/create";
import CreateDischargePort from "./modules/chartering/operation/dischargePort/create";
import EDPALoadPortCreate from "./modules/chartering/operation/edpaLoadPort/create";
import CreateonHireBunkerAndContionalSurvey from "./modules/chartering/operation/onHireBunkerAndContionalSurvey/create";
import RecapCreate from "./modules/chartering/operation/recap/create";

export const publicRouteList = [
  {
    path: "/chartering/operation/recap/create",
    component: RecapCreate,
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
