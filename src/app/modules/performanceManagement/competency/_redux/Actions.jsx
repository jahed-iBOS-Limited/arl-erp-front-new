import * as requestFromServer from "./Api";
import { competencyTwoSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = competencyTwoSlice;

export const getEmpDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getEmpDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetEmpDDL(data));
    }
  });
};

// action for save created data
export const saveCompetencyAction = (payload) => () => {
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
export const saveEditedCompetencyAction = (payload, cb) => () => {
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: "editedCompetency",
        });
        cb();
      }
    })
    .catch((err) => {
      console.log(err?.response);
      toast.error(err?.response?.data?.message);
    });
};
// action for get grid data
export const getEmployeeClusterListAction = () => (dispatch) => {
  return requestFromServer
    .getEmployeeClusterList()
    .then((res) => {
      return dispatch(slice.SetEmpClusterList(res.data));
    })
    .catch((err) => {
     
    });
};

// action for get grid data
export const getCompetencyGridData = (accId, buId) => (dispatch) => {
  return requestFromServer
    .getGridData(accId, buId)
    .then((res) => {
      return dispatch(slice.SetGridData(res.data?.data));
    })
    .catch((err) => {
     
    });
};

// action for get data by id single
export const getCompetencyIdAction = (id) => (dispatch) => {
  return requestFromServer
    .getDataById(id)
    .then((res) => {
      if (res.status === 200 && isArray(res.data)) {
        const item = res.data[0];
        const data = {
          ...item,
          objCompetency: {
            ...item.objCompetency,
            competencyType: item.objCompetency.isFunctionalCompetency
              ? { value: true, label: "Core competency" }
              : { value: false, label: "Functional competency" },
              isPositive: true
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
     
    });
};
// set single store empty
export const setCompetencyEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
