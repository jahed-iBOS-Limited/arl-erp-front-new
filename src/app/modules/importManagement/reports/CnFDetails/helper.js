import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

//ten days before
export const getTenDaysAgoDate = () => {
  let date = new Date();
  return _dateFormatter(date.setDate(date.getDate() - 10));
};

export const getCnfDDLForCnFReport = async (accId, businessUnit, setter) => {
  try {
    const res = await axios.get(
      `/imp/DocumentRelease/GetCnFDDLForDocumentRelease?accountId=${accId}&businessUnitId=${businessUnit}`
    );
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

// Get Customs Name DDL
export const GetCustomsNameDDLForCnfReport = async (
  setter,
  accId,
  businessUnitId
) => {
  try {
    let res = await axios.get(
      `/imp/ImportCommonDDL/GetCustomsName?accountId=${accId}&businessUnitId=${businessUnitId}`
    );
    // let res = await axios.get(`/imp/ImportCommonDDL/GetCustomsName`);
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};
//15 days ago date
export const getFifteenDaysAgoDate = () => {
  let date = new Date();
  return _dateFormatter(date.setDate(date.getDate() - 13));
};
export const getCnFDetailsReport = async (
  accId,
  buId,
  agentId,
  portId,
  fromDate,
  toDate,
  setter,
  setLoader
) => {
  setLoader(true);
  try {
    let query = `/imp/ImportReport/GetReportClearingAndForwarding?accountId=${accId}&businessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}`;

    if (agentId) {
      query += `&agentId=${agentId}`;
    }
    if (portId) {
      query += `&portId=${portId}`;
    }

    const res = await axios.get(query);
    setter(res?.data);

    setLoader(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoader(false);
  }
};
