import * as requestFromServer from "./Api";
import { pendingOrderSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = pendingOrderSlice;

export const getEmpDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getEmpDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetEmpDDL(data));
    }
  });
};

export const getShippointDDL_Action = (userId, accId, buId) => (dispatch) => {
  return requestFromServer.getShippointDDL(userId, accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      const item = data.map((item) => {
        return {
          label: item.organizationUnitReffName,
          value: item.organizationUnitReffId,
        };
      });
      dispatch(slice.SetShippointDDL(item));

      //dispatch(slice.SetShippointDDL(data));
    }
  });
};

// action for save created data
export const savePendingOrder = (payload) => () => {
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
// action for save edited data
export const saveEditedPendingOrder = (payload) => () => {
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

// action for get grid data
export const getPendingOrderGridDataAction = (
  accId,
  buId,
  shipPointId,
  setLoading,
  pageNo,
  pageSize
) => (dispatch) => {
  setLoading(true);
  return requestFromServer
    .getPendingOrderGridData(accId, buId, shipPointId, pageNo, pageSize)
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetPendingOrderGridData(res.data));
    })
    .catch((err) => {
      setLoading(false);
      //
    });
};

// action for get data by id single
export const getPendingOrderById = (id) => (dispatch) => {
  return requestFromServer
    .getDataById(id)
    .then((res) => {
      if (res.status === 200 && isArray(res.data)) {
        const item = res.data[0];
        const data = {
          ...item,
          responsiblePerson: {
            value: item.responsiblePerson,
            label: item.responsiblePersonName,
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
     
    });
};
// setPendingOrderGridDataEmptyAction
export const setPendingOrderGridDataEmptyAction = () => async (dispatch) => {
  return dispatch(slice.setPendingOrderGridDataEmpty());
};
