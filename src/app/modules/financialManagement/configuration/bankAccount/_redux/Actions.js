import * as requestFromServer from "./Api";
import { bankAccountSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = bankAccountSlice;

export const getBankDDLAction = () => (dispatch) => {
  return requestFromServer.getBankDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetBankDDL(data));
    }
  });
};

export const getBankAccountTypeDDLAction = () => (dispatch) => {
  return requestFromServer.getBankAccountTypeDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.setBankAccountTypeDDL(data));
    }
  });
};

// action for save created data
export const saveBankAccount = (payload) => () => {
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
      }
      payload.setDisabled(false);
    })
    .catch((err) => {
     
      toast.error(err?.response?.data?.message);
      payload.setDisabled(false);
    });
};
// action for save edited data
export const saveEditedBankAccount = (payload, setDisabled) => () => {
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
        console.log(res.data);
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
export const getBankAccountGridData = (
  accId,
  buId,
  setLoading,
  pageNo,
  pageSize
) => (dispatch) => {
  setLoading(true);
  return requestFromServer
    .getGridData(accId, buId, pageNo, pageSize)
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetGridData(res.data));
    })
    .catch((err) => {
     
      setLoading(false);
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
          accountName: item?.bankACName,
          accountNumber: item?.bankACNo,
          bank: {
            value: item?.bankId,
            label: item?.bankName,
          },
          branch: {
            value: item?.bankBranchId,
            label: item?.bankBranchName,
          },
          bankAccountType: {
            value: item?.bankACTypeId,
            label: item?.bankACTypeName,
          },
          generalLedger: {
            value: item?.generalLedgerId,
            label: item?.generalLedgerName,
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
     
    });
};
// set single store empty
export const setBankAccountSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};

// action for get view modal data
export const getViewModalData = (id) => (dispatch) => {
  return requestFromServer
    .getViewModalData(id)
    .then((res) => {
      return dispatch(slice.SetViewModalData(res.data));
    })
    .catch((err) => {
     
    });
};
