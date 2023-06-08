import Axios from "axios";
import { _monthFirstDate } from "../../_helper/_monthFirstDate";
import { _todayDate } from "../../_helper/_todayDate";
//getMonthlyTAXinfoDashBoard_api
export const getMonthlyTAXinfoDashBoard_api = async (accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/vat/DashBoard/GetDashBoardSdVatSurchase?accountId=${accid}&bsinessUnitId=${buid}&fromDate=${_monthFirstDate()}&toDate=${_todayDate()}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
//getItemWIsePurchaseDashBoard_api
export const getItemWIsePurchaseDashBoard_api = async (accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/vat/DashBoard/GetDashBoardPurchase?accountId=${accid}&bsinessUnitId=${buid}&taxTransactionTypeId=1&fromDate=${_monthFirstDate()}&toDate=${_todayDate()}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
//getItemWiseSalesDashBoard_api
export const getItemWiseSalesDashBoard_api = async (accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/vat/DashBoard/GetDashBoardBarchart?accountId=${accid}&bsinessUnitId=${buid}&fromDate=${_monthFirstDate()}&toDate=${_todayDate()}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

//getDashBoardSalesProduction_api
export const getDashBoardSalesProduction_api = async (accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/vat/DashBoard/GetDashBoardSalesProduction?accountId=${accid}&bsinessUnitId=${buid}&taxTransactionTypeId=1&fromDate=${_monthFirstDate()}&toDate=${_todayDate()}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

//DashBoardBarchartByTransactionType
export const getDashBoardBarchtByTracType_api = async (accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/vat/DashBoard/GetDashBoardBarchartByTransactionType?accountId=${accid}&bsinessUnitId=${buid}&fromDate=${_monthFirstDate()}&toDate=${_todayDate()}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
