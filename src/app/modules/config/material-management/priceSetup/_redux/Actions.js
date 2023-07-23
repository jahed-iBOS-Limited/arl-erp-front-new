import * as requestFromServer from "./Api";
import { priceSetupSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
const { actions: slice } = priceSetupSlice;

export const getAllPriceSetupInitialDDL = (accId, buId) => (dispatch) => {
  requestFromServer.callAllDDLApi(accId, buId).then((res) => {
    const [
      _resconditionDDL,
      _resorganizationDDL,
      _resterritoryDDL,
      _respartnerDDL,
      _resdistributionChannelDDL,
      _itemSalesList,
    ] = res;
    const { data: conditionDDL } = _resconditionDDL;
    const { data: organizationDDL } = _resorganizationDDL;
    const { data: territoryDDL } = _resterritoryDDL;
    const { data: partnerDDL } = _respartnerDDL;
    const { data: distributionChannelDDL } = _resdistributionChannelDDL;
    const { data: itemSalesDDL } = _itemSalesList;
    dispatch(
      slice.setALlInitDDL({
        conditionDDL,
        organizationDDL,
        territoryDDL,
        partnerDDL,
        distributionChannelDDL,
        itemSalesDDL,
      })
    );
  });
};

// action for save created data
export const savePriceSetup = (payload) => () => {
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
export const saveEditedPriceSetup = (payload) => () => {
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};
// action for get grid data
export const getPriceSetupGridData = (
  accId,
  buId,
  setDisabled,
  pageNo,
  pageSize
) => (dispatch) => {
  setDisabled(true);
  requestFromServer
    .getGridData(accId, buId, pageNo, pageSize)
    .then((res) => {
      dispatch(slice.SetGridData(res.data));
      setDisabled(false);
    })
    .catch((err) => {
      setDisabled(false);
    });
};
// action for get grid data
export const getItemByChannelIdAciton = (
  accId,
  buId,
  setDisabled,
  channelId
) => (dispatch) => {
  dispatch(slice.setItemByChanneList([]));
  setDisabled(true);
  requestFromServer
    .getItemByChannelId(accId, buId, channelId)
    .then((res) => {
      dispatch(slice.setItemByChanneList(res.data));
      setDisabled(false);
    })
    .catch((err) => {
      setDisabled(false);
    });
};

// action for get data by id single
export const getPriceSetupById = (id) => (dispatch) => {
  requestFromServer
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
        dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {});
};
// set single store empty
export const setPriceSetupEmpty = () => async (dispatch) => {
  dispatch(slice.SetSingleStoreEmpty());
};
