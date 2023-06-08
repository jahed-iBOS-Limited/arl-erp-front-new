import * as requestFromServer from "./Api";
import { generalLedgerSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = generalLedgerSlice;

export const getGroupDDLAction = () => (dispatch) => {
  return requestFromServer.getAccountGroupDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      return dispatch(slice.SetGroupDDL(data));
    }
  });
};
export const getClassDDLAction = (accId) => (dispatch) => {
  return requestFromServer.getAccountClassDDL(accId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      return dispatch(slice.SetClassDDL(data));
    }
  });
};
export const getCategoryDDLAction = (accId) => (dispatch) => {
  return requestFromServer.getAccountCategoryDDL(accId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      return dispatch(slice.SetCategoryDDL(data));
    }
  });
};

export const getAccountTypeDDLAction = () => (dispatch) => {
  return requestFromServer.getAccountTypeDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      return dispatch(slice.SetAccountTypeDDL(data));
    }
  });
};

// action for save created data
export const saveGeneralLedger = (payload) => () => {
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

// action for save edit data
export const editGeneralLedger = (payload) => () => {
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        toast.success(res.data?.message || "Submitted successfully");
      }
    })
    .catch((err) => {
      console.log(err?.response);
      toast.error(err?.response?.data?.message);
    });
};

export const getBUDDLAction = (accId) => (dispatch) => {
  return requestFromServer.getBuDDL(accId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      return dispatch(slice.SetBuDDL(data));
    }
  });
};

// action for save created data
export const saveExtendGeneralLedger = (payload) => () => {
  return requestFromServer
    .saveExtendData(payload)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        // payload.cb();
      }
    })
    .catch((err) => {
     
      toast.error(err?.response?.data?.message);
    });
};
// action for call grid data api
export const getGeneralLedgerGridData = (
  accId,
  buId,
  setLoading,
  pageNo,
  pageSize,
  search
) => (dispatch) => {
  setLoading(true);
  return requestFromServer
    .getGridData(accId, buId, pageNo, pageSize,search)
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetGridData(res.data));
    })
    .catch((err) => {
      setLoading(false);
     
    });
};

// action for get extend data by id
export const getGeneralLedgeExtendById = (id) => (dispatch) => {
  return requestFromServer
    .getExtendDataById(id)
    .then((res) => {
      return dispatch(slice.SetExtendData(res.data[0]));
    })
    .catch((err) => {
     
    });
};

// action for get data by id single
export const getGeneralLedgerById = (id) => (dispatch) => {
  return requestFromServer
    .getDataById(id)
    .then((res) => {
      if (res.status === 200 && isArray(res.data)) {
        const item = res.data[0];
        const data = {
          ...item,
          accountCategoryName: {
            value: item.accountCategoryId,
            label: item.accountCategoryName,
          },
        };
        console.log("res.data", res.data);
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
     
    });
};

// Controlling unit single to empty
export const setGeneralLedgerSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};

// action for call getAccountClassPagination_action
export const getAccountClassPagination_action = (accId, buId) => (dispatch) => {
  return requestFromServer
    .getAccountClassPagination(accId, buId)
    .then((res) => {
      return dispatch(slice.SetAccountClass(res.data?.data));
    })
    .catch((err) => {
     
    });
};

// action for call getAccountCategoryPasignation_Action
export const getAccountCategoryPasignation_action = (accId, buId) => (
  dispatch
) => {
  return requestFromServer
    .getAccountCategoryPasignation(accId, buId)
    .then((res) => {
      return dispatch(slice.SetAccountCategory(res.data?.data));
    })
    .catch((err) => {
     
    });
};

// action for call getAccountCategoryPasignation_Action
export const getGeneralLedgerPasignation_action = (accId, buId) => (
  dispatch
) => {
  return requestFromServer
    .getGeneralLedgerPasignation(accId, buId)
    .then((res) => {
      return dispatch(slice.SetGeneralLedger(res.data?.data));
    })
    .catch((err) => {
     
    });
};
