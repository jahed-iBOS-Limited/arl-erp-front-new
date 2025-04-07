import * as requestFromServer from "./Api";
import { partnerSalesSlice } from "./Slice";
const { actions: slice } = partnerSalesSlice;

// action for salesTerrioryDDL data
export const getSalesTerrioryDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getSalesTerrioryDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSalesTerrioryDDL(data));
    }
  });
};