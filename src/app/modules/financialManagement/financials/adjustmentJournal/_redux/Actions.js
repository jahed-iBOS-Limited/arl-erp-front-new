import * as requestFromServer from "./Api";
import { adjustmentJournalSlice } from "./Slice";
import { toast } from "react-toastify";
const { actions: slice } = adjustmentJournalSlice;

export const getSbuDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getSbuDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSbuDDL(data));
    }
  });
};

export const getGlAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getGlDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.setGLDDL(data));
    }
  });
};

// action for save created data
export const saveAdjustmentJournal = (payload) => () => {
  payload.setDisabled(true);
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.data?.statuscode === 200) {
        // toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
        payload.setDisabled(false);
        const obj = {
          title: "Adjustment Journal Code",
          message: res?.data?.code,
          noAlertFunc: () => {},
        };
        payload.IConfirmModal(obj);
      }
      if (res?.data?.statuscode === 400) {
        // toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
        payload.setDisabled(false);
        const obj = {
          title: "Something Went Wrong",
          message: res?.data?.message,
          noAlertFunc: () => {},
        };
        payload.IConfirmModal(obj);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
      payload.setDisabled(false);
    });
};
// action for save completed data
export const saveCompletedAdjustmentJournal = (
  payload,
  updateRowDto,
  setRowDto
) => () => {
  return requestFromServer
    .saveCompleteData(payload)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        setRowDto(updateRowDto);
        payload.cb();
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};
// action for save edited data
export const saveEditedAdjustmentJournal = (payload, setDisabled) => () => {
  setDisabled(true);
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        setDisabled(false);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      setDisabled(false);
    });
};

// action for save cancel data
export const saveCancelAdjustmentJournal = (
  payload,
  updateRowDto,
  setRowDto
) => () => {
  return requestFromServer
    .saveCancelData(payload)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        setRowDto(updateRowDto);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};

// action for get grid data
export const getCashJournalGridData = (
  buId,
  sbuId,
  accJournalTypeId,
  isPosted,
  isActive,
  fromdate,
  todate,
  setLoading,
  pageNo,
  pageSize
) => (dispatch) => {
  setLoading(true);
  return requestFromServer
    .getGridData(
      buId,
      sbuId,
      accJournalTypeId,
      isPosted,
      isActive,
      fromdate,
      todate,
      pageNo,
      pageSize
    )
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetGridData(res.data));
    })
    .catch((err) => {
      setLoading(false);
    });
};

export const EmptyAdjustmentJournalGridData = () => (dispatch) => {
  dispatch(slice.SetGridData([]));
};

// action for get grid data
export const getCashJournalGridDatabyCode = (
  buId,
  sbuId,
  voucherCode,
  setFieldValue,
  setLoading
) => (dispatch) => {
  setLoading(true);
  return requestFromServer
    .getGridDatabyCode(buId, sbuId, voucherCode)
    .then((res) => {
      let status;
      const { isPosted, isActive } = res?.data?.[0];
      if (isPosted === false && isActive === true) {
        status = "notComplated";
      } else if (isPosted === true && isActive === true) {
        status = "complated";
      } else {
        status = "canceled";
      }
      setFieldValue("type", status);
      setFieldValue("code", "");
      setLoading(false);
      return dispatch(slice.SetGridData(res?.data));
      //setComplete("")
    })
    .catch((err) => {
      dispatch(slice.SetGridData([]));
      setLoading(false);
    });
};
