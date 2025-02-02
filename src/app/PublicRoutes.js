import { lazy } from 'react';
const EDPALoadPortCreate = lazy(() =>
  import('./modules/shippingOperation/epdaManagement/loadPort/create'),
);
const CreateonHireBunkerAndContionalSurvey = lazy(() =>
  import(
    './modules/shippingOperation/hireBunkerAndContionalSurvey/onHireBunkerACS/create'
  ),
);
const VesselNominationAcceptanceCreate = lazy(() =>
  import(
    './modules/shippingOperation/vesselNomination/vesselNominationResponse/create'
  ),
);
const DeadWeightCreate = lazy(() =>
  import(
    './modules/shippingOperation/deadWeightPreStowagePlanning/deadWeightPreStowagePlanningChild/create'
  ),
);
const CreateDischargePort = lazy(() =>
  import('./modules/shippingOperation/departureDocuments/dischargePort/create'),
);
const EDPADischargePortCreate = lazy(() =>
  import('./modules/shippingOperation/epdaManagement/dischargePort/create'),
);
const CreateLoadPort = lazy(() =>
  import('./modules/shippingOperation/departureDocuments/loadPort/create'),
);
const SuccessMessageComponent = lazy(() =>
  import('./modules/publicRouteComponents/success'),
);
const ErrorMessageComponent = lazy(() =>
  import('./modules/publicRouteComponents/error'),
);

export const publicRouteList = [
  {
    path:
      '/chartering/operation/vesselNominationAcceptance/accept/:paramId/:paramCode',
    component: VesselNominationAcceptanceCreate,
    exact: true,
  },
  {
    path: '/chartering/operation/epdaLoadPort/create/:paramId/:paramCode',
    component: EDPALoadPortCreate,
    exact: true,
  },
  {
    path: '/chartering/operation/epdaDischargePort/create/:paramId/:paramCode',
    component: EDPADischargePortCreate,
    exact: true,
  },
  {
    path:
      '/chartering/operation/pre-stowagePlanning/create/:paramId/:paramCode',
    component: DeadWeightCreate,
    exact: true,
  },
  {
    path:
      '/chartering/operation/onHireBunkerAndContionalSurvey/create/:paramId/:paramCode',
    component: CreateonHireBunkerAndContionalSurvey,
    exact: true,
  },
  {
    path:
      '/chartering/operation/dischargePortDepartureDocuments/create/:paramId/:paramCode',
    component: CreateDischargePort,
    exact: true,
  },
  {
    path:
      '/chartering/operation/loadPortDepartureDocuments/create/:paramId/:paramCode',
    component: CreateLoadPort,
    exact: true,
  },
  {
    path: '/external/paymentgateway/pubali/success',
    component: SuccessMessageComponent,
    exact: true,
  },
  {
    path: '/external/paymentgateway/pubali/failed',
    component: ErrorMessageComponent,
    exact: true,
  },
];

export default publicRouteList;
