import * as requestFromServer from "./Api";
import { departmentSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = departmentSlice;



export const getDepartmentDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getDepartmentDDLApi(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      return dispatch(slice.SetDepartmentDDL(data));
    }
  });
};

export const getDesignationDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getDesignationDDLApi(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      return dispatch(slice.SetDesignationDDL(data));
    }
  });
};


// Save Controlling Unit into DB
export const saveDepartment = (payload) => () => {
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
// Save Edited Controlling Unit into DB
export const saveEditDepartment = (payload) => () => {
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
// Controlling unit action for get data of table
export const getGridData = (accId,buId) => (dispatch) => {
  return requestFromServer
    .getGridData(accId,buId)
    .then((res) => {
      return dispatch(slice.SetGridData(res.data?.data));
    })
    .catch((err) => {
     
    });
};

// Controlling unit action for get single data by id
export const getDepartmentByIdAction = (accId,buId,id) => (dispatch) => {
  return requestFromServer
    .getDataById(accId, buId,id)
    .then((res) => {
      if (res.status === 200 && isArray(res.data)) {
        const item = res.data[0];
        const data = {
          ...item,
     
          // responsiblePerson: {
          //   value: item.responsiblePerson,
          //   label: item.responsiblePersonName,
          // },
        };
      
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
     
    });
};
// Controlling unit single to empty
export const setControllingUnitSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
