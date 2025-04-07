import { toast } from 'react-toastify';
import * as requestFromServer from './Api';
import { coporateKpiDeshboardSlice } from './Slice';
const { actions: slice } = coporateKpiDeshboardSlice;

export const getUnFavouriteDDLAction = (buId, empId, yearId) => (dispatch) => {
  return requestFromServer
    .getUnFavouriteDDL(buId, empId, yearId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetunPavDDL(data));
      }
    });
};

// action for save edited data
export const updateUnpovAction = (payload, cb) => () => {
  return requestFromServer
    .updateUnpov(payload)
    .then((res) => {
      if (res.status === 200) {
        cb();
      }
    })
    .catch((err) => {
      console.log(err?.response);
      toast.error(err?.response?.data?.message);
    });
};

// set single store empty
export const setControllingUnitSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};

export const getReportAction =
  (
    buId,
    reportTypeRefId,
    yearId,
    fromMonth,
    toMonth,
    isDashboard,
    reportType,
    sectionId
  ) =>
  (dispatch) => {
    return requestFromServer
      .getReport(
        buId,
        reportTypeRefId,
        yearId,
        fromMonth,
        toMonth,
        isDashboard,
        reportType,
        sectionId
      )
      .then((res) => {
        const { status, data } = res;
        if (status === 200 && data) {
          dispatch(slice.SetReportData(data));
        }
      });
  };
export const setReportEmpty = () => async (dispatch) => {
  return dispatch(slice.SetReportEmpty());
};
