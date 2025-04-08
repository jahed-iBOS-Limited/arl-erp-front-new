import { partnerSalesSlice } from '../../../../../partnerBasicInfo/patnerEdit/collpaseComponent/partnerSales/_redux/Slice';
import * as requestFromServer from './Api';
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
