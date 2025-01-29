import * as requestFromServer from "./Api";
import { corporatePerformanceChartSlice } from "./Slice";
import { toast } from "react-toastify";
const { actions: slice } = corporatePerformanceChartSlice;

// action for save created data
export const saveMeasuringScaleAction = (payload) => () => {
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
        payload.setRowDto([]);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};

export const updateChartTypeAction = (
  kpiId,
  chartId,
  callGetReportAction
) => () => {
  return requestFromServer
    .updateChartType(kpiId, chartId)
    .then((res) => {
      if (res.status === 200) {
        callGetReportAction();
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};

export const updateIsShownAction = (kpiId, tf, callGetReportAction) => () => {
  return requestFromServer
    .updateIsShown(kpiId, tf)
    .then((res) => {
      if (res.status === 200) {
        callGetReportAction();
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};

export const getChartTypeDDLAction = () => (dispatch) => {
  return requestFromServer
    .getChartTypeDDL()
    .then((res) => {
      return dispatch(slice.SetGridData(res.data?.data));
    })
    .catch((err) => {});
};

export const getMonthDDLAction = (yearId) => (dispatch) => {
  return requestFromServer
    .getMonthDDL(yearId)
    .then((res) => {
      return dispatch(slice.SetMonthDDL(res.data));
    })
    .catch((err) => {});
};
