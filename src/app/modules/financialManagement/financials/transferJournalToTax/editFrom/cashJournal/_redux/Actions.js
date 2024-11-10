import * as requestFromServer from "./Api";
import { cashJournalSlice } from "./Slice";
import { toast } from "react-toastify";
const { actions: slice } = cashJournalSlice;

// action for save created data
export const saveCashJournal_Action = (payload) => () => {
  payload.setDisabled(true);
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
        payload.setDisabled(false);
        const obj = {
          title: "Cash Journal Code",
          message: res?.data?.code,
          noAlertFunc: () => {},
        };
        payload.IConfirmModal(obj);
      }
    })
    .catch((err) => {
      console.log(err);
      toast.error(err?.response?.data?.message);
      payload.setDisabled(false);
    });
};

// action for get grid data
export const getCashJournalGridData = (
  accId,
  buId,
  sbuId,
  accJournalTypeId,
  isPosted,
  isActive,
  fromdate,
  todate,
  setLoading,
  pageNo,
  setPageNo
) => (dispatch) => {
  setLoading(true);
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
      setPageNo
    )
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetGridData(res.data));
    })
    .catch((err) => {
      setLoading(false);
      console.log(err);
    });
};
// action for get grid data
export const getCashJournalGridDatabyCode = (
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
    .catch((err) => {
      console.log(err);
    });
};

export const EmptyCashJournalGridData = () => (dispatch) => {
  dispatch(slice.SetGridData([]));
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
      console.log(err?.response);
      toast.error(err?.response?.data?.message);
    });
};

// action for save edited data
export const saveCancel_action = (payload, updateRowDto, setRowDto) => () => {
  return requestFromServer
    .saveCancel(payload)
    .then((res) => {
      if (res.status === 200) {
        setRowDto(updateRowDto);
        toast.success(res.data?.message || "Submitted successfully");
      }
    })
    .catch((err) => {
      console.log(err?.response);
      toast.error(err?.response?.data?.message);
    });
};
