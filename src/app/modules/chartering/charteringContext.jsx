import { createContext } from 'react';
import { _firstDateofMonth } from '../_helper/_firstDateOfCurrentMonth';
import { _todayDate } from './_chartinghelper/_todayDate';

const commonFields = {
  vesselName: '',
  voyageNo: '',
};

export const CharteringState = {
  transactionTimeChartererLandingInitData: {
    filterBy: '',
    fromDate: '',
    toDate: '',
    voyageNo: '',
    vesselName: '',
  },
  hireOwnerLandingInitData: {
    voyageType: { value: 'timeCharter', label: 'Time Charter' },
    vesselName: '',
    voyageNo: '',
  },
  hireChartererLandingInitData: {
    voyageType: { value: 'timeCharter', label: 'Time Charter' },
    vesselName: '',
    voyageNo: '',
  },
  lighterVesselLandingInitData: {
    status: { value: null, label: 'All' },
    lighterVessel: { value: 0, label: 'All' },
    fromDate: _firstDateofMonth(),
    toDate: _todayDate(),
  },
  cpClauseLandingInitData: {
    fromDate: _firstDateofMonth(),
    toDate: _todayDate(),
  },
  voyageLandingFormData: {
    status: { value: 0, label: 'All' },
    ...commonFields,
  },
  offHireLandingFormData: {
    viewType: { value: 1, label: 'Top Sheet' },
    ...commonFields,
  },
  bunkerCostLandingFormData: commonFields,
  bunkerInformationLandingFormData: commonFields,
  purchaseBunkerLandingFormData: commonFields,
  expenseLandingFormData: commonFields,
  timeCharterLandingFormData: commonFields,
  voyageCharterLandingFormData: commonFields,
};

export const CharteringContext = createContext(CharteringState);

// export const CharteringReducer = (state, action) => {

//   switch (action.type) {
//     case "setTransactionTimeChartererLandingInitData":
//       return {
//         ...state,
//         transactionTimeChartererLandingInitData: action.payload,
//       };
//     case "setHireLandingInitData":
//       CharteringState.hireLandingInitData = action?.payload;
//       break;
//     default:
//       return state;
//   }
// };
