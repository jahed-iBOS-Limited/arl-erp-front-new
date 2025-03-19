import * as requestFromServer from "./Api";
import { strategicParticularsTwoSlice } from "./Slice";
import { toast } from "react-toastify";
const { actions: slice } = strategicParticularsTwoSlice;

// Action for get Department DDL
export const getDepartmentDDLAction = (accId, buId, setDepDDL) => (dispatch) => {
  return requestFromServer.getDepartmentDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetDepartmentDDL(data));
      setDepDDL && setDepDDL(data)
    }
  });
};

// Action for get StrategicObjectiveType DDL
export const getStrategicObjectiveTypeDDLAction = (accId, buId) => (
  dispatch
) => {
  return requestFromServer
    .getStrategicObjectiveTypeDDL(accId, buId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetStrategicObjectiveTypeDDLAction(data));
      }
    });
};

//Action for get StrategicParticularsType DDL
export const getStrategicParticularsTypeDDLAction = (accId, buId) => (
  dispatch
) => {
  return requestFromServer
    .getStrategicParticularsTypeDDL(accId, buId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetStrategicParticularsTypeDDL(data));
      }
    });
};

export const getStrObjListAction = (strTypeId, strId) => (dispatch) => {
  return requestFromServer.getStrObjList(strTypeId, strId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetStrObjList(data));
    }
  });
};

export const getStrTargetAction = (year, strId) => (dispatch) => {
  return requestFromServer.getStrTarget(year, strId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetStrTarget(data));
    }
  });
};

// str create page quarterly or yearly or monthly grid
export const getStrategicParticularsGridActions = (
  accId,
  buId,
  yearId,
  yearRange,
  frequencyId,
  loopCount,
  values
) => (dispatch) => {
  return requestFromServer
    .getStrategicParticularsGrid(
      accId,
      buId,
      yearId,
      yearRange,
      frequencyId,
      loopCount
    )
    .then((res) => {
      let data = [];
      const {label} = values?.strategicParticularType;
      if(label === "Initiatives" || label === "Program" || label === "Project" || label === "Milestone"){
        data.push(res?.data?.[0])
      }else{
        data = [...res?.data];
      }
      dispatch(slice.SetStrategicParticularsGrid({ data, frequencyId }));
    });
};

export const SetStrategicParticularsGridEmpty = () => (dispatch) => {
  dispatch(slice.SetStrategicParticularsGrid(""));
};



// action for save created data
export const saveStrategicParticulars = (payload) => () => {
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
export const saveEditedStrategicParticulars = (payload) => () => {
  return requestFromServer
    .saveEditData(payload?.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
      }
    })
    .catch((err) => {
      console.log(err?.response);
      toast.error(err?.response?.data?.message);
    });
};

// action for get grid data
export const StrategicParticularsgetPaginationAction = (accId, buId, refId, type, categoryId, isActive, setLoading, pageNo, pageSize, yearId) => (
  dispatch
) => {
  setLoading(true)
  return requestFromServer
    .getGridData(accId, buId, refId, type, categoryId, isActive, pageNo, pageSize, yearId)
    .then((res) => {
      setLoading(false)
      return dispatch(slice.SetGridData(res?.data));
    })
    .catch((err) => {
      setLoading(false)
      toast.error("Something went wrong")
    });
};

// set single store empty
export const setParticullersGridEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};

// action for get data by id single
export const getStrategicParticularsById = (id) => (dispatch) => {
  return requestFromServer
    .getDataById(id)
    .then((res) => {
      if (res.status === 200 && res.data) {
        const item = res.data;
        const {
          sbuid,
          sbuName,
          departmentId,
          departmentName,
          bscperspectiveId,
          bscperspectiveName,
          strategicParticularsTypeId,
          strategicParticularsTypeName,
          parentId,
          parentName,
          ownerId,
          ownerName,
          priorityId,
          priorityName,
          maxiMini,
          aggregation,
          yearId,
          yearName,
          planTypeId,
          planTypeName
        } = item?.objHeader;
        const data = {
          objHeader: {
            ...item.objHeader,
            sbu: {
              value: sbuid,
              label: sbuName,
            },
            planType: {value : planTypeId, label : planTypeName},
            department: {
              value: departmentId,
              label: departmentName,
            },
            bscPerspective: {
              value: bscperspectiveId,
              label: bscperspectiveName,
            },
            strategicParticularType: {
              value: strategicParticularsTypeId,
              label: strategicParticularsTypeName,
            },
            forObjective: {
              value: parentId,
              label: parentName,
            },
            owner: {
              value: ownerId,
              label: ownerName,
            },
            priority: {
              value: priorityId,
              label: priorityName,
            },
            maxi_mini: {
              value: maxiMini === "Minimization" ? 1 : 2,
              label: maxiMini,
            },
            aggregationType: {
              value: 1,
              label: aggregation,
            },
            year: {
              value: yearId,
              label: yearName,
            },
            targetFrequency: {
              value: yearId,
              label: yearName,
            },
          },
          objListRow: [...item.objListRow],
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
     
    });
};
// set single store empty
export const getStrategicParticularsSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty_());
};
