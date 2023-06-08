import * as requestFromServer from "./Api";
import { bankJournalSlice } from "./Slice";
import { toast } from "react-toastify";const { actions: slice } = bankJournalSlice;
// action for save created data
export const saveCashJournal_Action = (payload) => () => {
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};

// action for get grid data
export const getBankJournalGridData = (
  accId,
  buId,
  sbuId,
  accJournalTypeId,
  isPosted,
  isActive,
  fromdate,
  todate,
  setLanding,
  pageNo,
  pageSize
) => (dispatch) => {
  setLanding(true);
  return requestFromServer
    .getGridData(
      accId,
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
      setLanding(false);
      return dispatch(slice.SetGridData(res.data));
    })
    .catch((err) => {
      dispatch(slice.SetGridData([]));

      setLanding(false);
    });
};

export const EmptyBankJournalGridData = () => (dispatch) => {
  dispatch(slice.SetGridData([]));
};

// action for get grid data
export const getBankJournalGridDatabyCode = (
  accId,
  buId,
  values,
  setFieldValue
) => (dispatch) => {
  const { code, sbu } = values;
  return requestFromServer
    .getGridDatabyCode(accId, buId, sbu?.value, code)
    .then((res) => {
      let status;
      const { isPosted, isActive } = res?.data?.data[0];
      if (isPosted === false && isActive === true) {
        status = "notComplated";
      } else if (isPosted === true && isActive === true) {
        status = "complated";
      } else {
        status = "canceled";
      }
      setFieldValue("type", status);
      return dispatch(slice.SetGridData(res.data));
      //setComplete("")
    })
    .catch((err) => {});
};

// action for save edited data
export const saveEditedBankJournal = (payload, setDisabled) => () => {
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

// action for save edited data
export const saveCompleted_action = (
  payload,
  updateRowDto,
  setRowDto
) => () => {
  return requestFromServer
    .saveCompleted(payload)
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

// action for save edited data
export const saveCancel_action = (payload, updateRowDto, setRowDto) => () => {
  return requestFromServer
    .saveCancel(payload)
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
