import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { _dateFormatter } from "../../../_helper/_dateFormate";

//validation schema;
export const validationSchema = Yup.object().shape({
  fromDate: Yup.date().required("From Date is required"),
  toDate: Yup.date().required("To Date is required"),
  lcNumber: Yup.string().required("LC Number is required"),
  providor: Yup.string().required("Providor is required"),
});

// bank ddl
// /imp/ImportCommonDDL/GetProviderDDL?accountId=2&businessUnitId=164
export const GetBankDDL = async (setter, accId, businessUnitId) => {
  try {
    const res = await axios.get(
      `/imp/ImportCommonDDL/GetProviderDDL?accountId=${accId}&businessUnitId=${businessUnitId}`
    );
    // const res = await axios.get(`/imp/ImportCommonDDL/GetBankListDDL`);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};

export const getFifteenDaysAgoDate = () => {
  let date = new Date();
  return _dateFormatter(date.setDate(date.getDate() - 13));
};

export const getTenDaysAgoDate = () => {
  let date = new Date();
  return _dateFormatter(date.setDate(date.getDate() - 10));
};

// Get Insurance Cover Note Report
export const getInsuranceCoverNoteReport = async (
  buId,
  accId,
  poNumber,
  providerId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  // /imp/ImportReport/GetInsuranceReport?accountId=2&businessUnitId=164&poNumber=PO-DBU-JUL21-158&providerId=1310&fromDate=2021-05-01&toDate=2021-08-07
  try {
    let query = `/imp/ImportReport/GetInsuranceReport?accountId=${accId}&businessUnitId=${buId}`;
    if (poNumber) {
      query += `&poNumber=${poNumber}`;
    }
    if (providerId) {
      query += `&providerId=${providerId}`;
    }

    query += fromDate ? `&fromDate=${fromDate}&toDate=${toDate}` : "";

    setLoading(true);
    const res = await axios.get(query);
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
