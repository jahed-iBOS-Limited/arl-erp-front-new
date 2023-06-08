import axios from "axios";
import { toast } from "react-toastify";

export const GetBankDDLForDocReleaseReport = async (
  setter,
  accId,
  businessUnitId
) => {
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

// get report
export const GetDocReleaseReport = async (
  buId,
  bankId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    let query = `/imp/ImportReport/GetReportDocumentRelease?fromDate=${fromDate}&toDate=${toDate}&businessUnitId=${buId}`;
    if (bankId) {
      query += `&bankId=${bankId}`;
    }
    const res = await axios.get(query);
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
    setLoading(false);
  }
};
