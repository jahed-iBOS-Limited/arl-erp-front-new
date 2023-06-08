import * as requestFromServer from "./Api";
import { taxBranchSlice } from "./Slice";
import { toast } from "react-toastify";
const { actions: slice } = taxBranchSlice;

export const getBuDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getBuDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetBuDDL(data));
    }
  });
};

// action for getting country
export const getCountryDDLAction = () => (dispatch) => {
  return requestFromServer.getcountryDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetCountryDDL(data));
    }
  });
};

// action for getting state/division
export const getDivisionDDLAction = (coId) => (dispatch) => {
  return requestFromServer.getdivisionDDL(coId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetDivisionDDL(data));
    }
  });
};

// action for getting city/district
export const getDistrictDDLAction = (coId, divId) => (dispatch) => {
  return requestFromServer.getdistrictDDL(coId, divId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetDistrictDDL(data));
    }
  });
};

// action for getting policeStation
export const getPoliceStationDDLAction = (coId, divId, disId) => (dispatch) => {
  return requestFromServer
    .getpoliceStationDDL(coId, divId, disId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        let newData = data.map((item) => {
          return {
            value: item?.value,
            label: `${item?.label} [${item?.code}]`,
            code: item?.code,
            dtedate: item?.dtedate,
            name: item?.label,
          };
        });
        if (newData.length > 0) {
          dispatch(slice.SetPoliceStationDDL(newData));
        }
      }
    });
};

// action for getting postCode
export const getPostCodeDDLAction = (thanaId, setFieldValue) => (dispatch) => {
  return requestFromServer.getpostCodeDDL(thanaId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      let newData = data.map((item) => {
        return {
          code: item?.code,
          label: item?.code,
          name: item?.name,
          subId: item?.subId,
          uomId: item?.uomId,
          uomName: item?.uomName,
          value: item?.value,
        };
      });
      if (newData.length > 0 && setFieldValue) {
        setFieldValue("postCode", newData[0]);
        dispatch(slice.SetPostCodeDDL(newData));
      }
    }
  });
};

// action for save created data
export const saveTaxBranch = (payload, setDisabled) => () => {
  payload.setDisabled(true);
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: "saveTaxBranch",
        });
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
export const saveEditedBranchData = (payload, setDisabled) => () => {
  setDisabled(true);
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: "saveEditedBranchData",
        });
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
export const getBranchGridData = (accId, buId, setLoading, pageNo, pageSize) => (dispatch) => {
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
      if (res.status === 200 && res?.data) {
        const item = res?.data?.[0];
        const data = {
          branchName: item?.taxBranchName,
          address: item?.taxBranchAddress,
          businessUnit: {
            value: item?.businessUnitId,
            label: item?.businessUnitName,
          },
          country: {
            value: item?.countryId,
            label: item?.country,
          },
          division: {
            value: item?.stateId,
            label: item?.state,
          },
          district: {
            value: item?.cityId,
            label: item?.city,
          },
          policeStation: {
            value: item?.policeStationId,
            label: item?.policeStation,
          },
          postCode: {
            value: item?.postCodeId,
            label: item?.postCode,
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
     
    });
};
// set single store empty
export const setBranchSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
