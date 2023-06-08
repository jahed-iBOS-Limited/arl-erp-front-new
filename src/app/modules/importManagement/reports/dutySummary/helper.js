import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

//ten days before
export const getTenDaysAgoDate = () => {
  let date = new Date();
  return _dateFormatter(date.setDate(date.getDate() - 10));
};

// Get Customs Name DDL
export const GetCustomsNameDDL = async (setter, accId, businessUnitId) => {
  try {
    let res = await axios.get(
      `/imp/ImportCommonDDL/GetCustomsName?accountId=${accId}&businessUnitId=${businessUnitId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

//15 days ago date
export const getFifteenDaysAgoDate = () => {
  let date = new Date();
  return _dateFormatter(date.setDate(date.getDate() - 13));
};
export const getDutySummaryReport = async (
  accId,
  buId,
  customsPartnerID,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  // const FromDate = fromDate ?? "";
  // const ToDate = toDate ?? "";
  // const customsPartnerId = customsPartnerID ?? "";

  setLoading(true);
  try {
    let query = `/imp/ImportReport/GetCustomDutyReport?accountId=${accId}&businessUnitId=${buId}`;
    if (customsPartnerID) {
      query += `&customsPartnerId=${customsPartnerID}`;
    }
    query += fromDate ? `&fromDate=${fromDate}&toDate=${toDate}` : "";

    // let res = await axios.get(
    //   `/imp/ImportReport/GetCustomDutyReport?accountId=${accId}&businessUnitId=${buId}&customsPartnerId=${customsPartnerId}&fromDate=${FromDate}&toDate=${ToDate}`
    // );
    let res = await axios.get(query);
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setLoading(false);
  }
};
