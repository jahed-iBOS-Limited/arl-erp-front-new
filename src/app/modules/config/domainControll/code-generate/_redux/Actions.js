import * as requestFromServer from "./Api";
import { codeGenerateSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = codeGenerateSlice;

export const getCodeTypeDDLAction = () => (dispatch) => {
  return requestFromServer.getCodeTypeDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
       dispatch(slice.SetCodeTypeDDL(data));
    }
  });
};

// action for save created data
export const saveCodeGenerate = (payload) => () => {
  payload.setDisabled(true);
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
        payload.setDisabled(false);
      }
    })
    .catch((err) => {
     
      toast.error(err?.response?.data?.message);
      payload.setDisabled(false);
    });
};
// action for save edited data
export const saveEditedCodeGenerate = (payload, setDisabled) => () => {
  setDisabled(true);
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
        // console.log(res.data);
        toast.success(res.data?.message || "Submitted successfully");
        setDisabled(false);
      }
    })
    .catch((err) => {
      console.log(err?.response);
      toast.error(err?.response?.data?.message);
      setDisabled(false);
    });
};
// action for get grid data
export const getCodeGenerateGridData = (accId, buId, pageNo, pageSize, setLoading) => (dispatch) => {
  setLoading(true);
  return requestFromServer
    .getGridData(accId, buId, pageNo, pageSize)
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetGridData(res?.data));
    })
    .catch((err) => {
      setLoading(false);
      //
    });
};

// action for get data by id single
export const getSingleById = (id) => (dispatch) => {
  return requestFromServer
    .getDataById(id)
    .then((res) => {
      if (res.status === 200 && isArray(res.data)) {
        const item = res.data[0];
        const data = {
          ...item,
          codeType: {
            value: item.codegeneratorId,
            label: item.codegeneratorType
          },
          refreshType: {
            value: item.refreshTypeId,
            label: item.refreshType
          },
          monthLength: {
            value: item.monthLengthTypeId,
            label: item.monthLengthType
          },
          yearLength: {
            value: item.yearLengthTypeId,
            label: item.yearLengthType
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
     
    });
};
// set single store empty
export const setCodeGenerateSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
