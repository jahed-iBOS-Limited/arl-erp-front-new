import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _todayDate } from "../../../_helper/_todayDate";

//validation schema;
export const validationSchema = Yup.object().shape({
  indent: Yup.string().required("Indent is required"),
  poNumber: Yup.string().required("PO Number is required"),
  lcNumber: Yup.string().required("LC Number is required"),
});

export const GetBankDDL = async (setter, accId, businessUnitId) => {
  try {
    const res = await axios.get(
      `/imp/ImportCommonDDL/GetBankListDDL?accountId=${accId}&businessUnitId=${businessUnitId}`
    );
    // const res = await axios.get(`/imp/ImportCommonDDL/GetBankListDDL`);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};

//15 days ago date
export const getFifteenDaysAgoDate = () => {
  let date = new Date();
  return _dateFormatter(date.setDate(date.getDate() - 13));
};

export const getTenDaysAgoDate = () => {
  let date = new Date();
  return _dateFormatter(date.setDate(date.getDate() - 10));
};

export const getReport = async (
  accId,
  buId,
  poNo,
  lcNo,
  bankId,
  fromDate,
  toDate,
  beneficiaryId,
  setter,
  setLoading
) => {
  // const search = searchValue ?? "";
  // const FromDate = fromDate ?? "";
  // const ToDate = toDate ?? "";
  // const bankID = bankId ?? "";
  // const beneficiaryID = beneficiaryId ?? "";

  setLoading(true);
  try {
    // let query = `/imp/ImportReport/GetReportLCPO?accountId=${accId}&businessUnitId=${buId}`;
    let query = `/imp/ImportReport/GetLcRegisterReport?&businessUnitId=${buId}&fromDate=${fromDate ||
      getFifteenDaysAgoDate()}&toDate=${toDate || _todayDate()}`;
    // if (poLcId) {
    //   query += `&search=${poLcId}`;
    // }
    // if (beneficiaryId) {
    //   query += `&beneficiaryId=${beneficiaryId}`;
    // }
    if (poNo) {
      query += `&poNo=${poNo}`;
    }
    if (lcNo) {
      query += `&lcNo=${lcNo}`;
    }
    if (bankId) {
      query += `&bankId=${bankId}`;
    }
    // query += fromDate
    //   ? `&fromDate=${fromDate || getFifteenDaysAgoDate()}&toDate=${toDate ||
    //       _todayDate()}`
    //   : "";
    setLoading(true);
    const res = await axios.get(query);

    // let res = await axios.get(
    //   `/imp/ImportReport/GetReportLCPO?accountId=${accId}&businessUnitId=${buId}&search=${search}&fromDate=${FromDate}&toDate=${ToDate}&beneficiaryId=${beneficiaryID}&bankId=${bankID}`
    //  );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setLoading(false);
  }
};
