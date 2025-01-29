import * as requestFromServer from "./Api";
import { tradeOfferSlice } from "./Slice";
import { toast } from "react-toastify";
const { actions: slice } = tradeOfferSlice;

// action for get grid data
export const getTradeOfferGridData = (
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

// conditionTypeDDL
export const getConditionTypeDDLAction = () => (dispatch) => {
  requestFromServer.getConditionTypeDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetConditionTypeDDL(res.data));
    }
  });
};

// rounding type ddl
export const getRoundingTypeDDLAction = () => (dispatch) => {
  return requestFromServer.getRoundingTypeDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      const ddlTemp = [];
      data.forEach((itm) => {
        const items = {
          value: itm.roundingTypeId,
          label: itm.roundingTypeName,
        };
        ddlTemp.push(items);
      });
      return dispatch(slice.SetRoundingTypeDDL(ddlTemp));
    }
  });
};

// call all ddl
export const getAllDDLAction = (accId, buId) => (dispatch) => {
  requestFromServer.getAllDDL(accId, buId).then((res) => {
    const [
      itemListDDL,
      itemGroupDDL,
      salesDDL,
      distributionDDL,
      salesTerritoryDDL,
      partnerDDL,
    ] = res;
    dispatch(
      slice.SetAllDDL({
        itemListDDL,
        itemGroupDDL,
        salesDDL,
        distributionDDL,
        salesTerritoryDDL,
        partnerDDL,
      })
    );
  });
};

// set single store empty
export const setControllingUnitSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};

// action for save created data
export const saveTradeOffer = (payload) => () => {
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
