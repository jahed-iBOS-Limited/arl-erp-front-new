import * as requestFromServer from "./Api";
import { distributionChannelSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = distributionChannelSlice;

export const GetSBUListDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.GetSBUListDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data && data.length > 0) {
      dispatch(slice.SetSBUListDDL(data));
    }
  });
};
// action for save created data
export const saveDistributionChannel = (payload, setDisabled) => () => {
  setDisabled(true);
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
        setDisabled(false);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      setDisabled(false);
    });
};
// action for save edited data
export const saveEditedDistributionChannel = (payload, setDisabled) => () => {
  setDisabled(true);
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
export const getDistributionChanneData = (
  accId,
  buId,
  setLoading,
  pageNo,
  pageSize,
  search
) => (dispatch) => {
  setLoading(true);
  return requestFromServer
    .getGridData(accId, buId, pageNo, pageSize, search)
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetGridData(res.data));
    })
    .catch((err) => {
      setLoading(false);
    });
};
// action for get data by id single
export const getDistributionChannelById = (id, setDisabled) => (dispatch) => {
  setDisabled && setDisabled(true)
  return requestFromServer
    .getDataById(id)
    .then((res) => {
      setDisabled && setDisabled(false)
      if (res.status === 200 && isArray(res?.data)) {
        const item = res?.data?.[0];
        const data = {
          ...item,
          SBU: item?.sbuid ? {
            value: item?.sbuid,
            label: item?.sbuname,
          }: "",
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
      setDisabled && setDisabled(false)
    });
};
// set single store empty
export const setDistributionChannelSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
