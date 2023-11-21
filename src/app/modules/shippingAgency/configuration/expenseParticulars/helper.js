import axios from "axios";
import { imarineBaseUrl } from "../../../../App";
import { toast } from "react-toastify";

export const categoryDDL = [
  { value: 1, label: "Gov" },
  { value: 2, label: "Operation" },
  { value: 3, label: "Party" },
];

export const createUpdateExpenseParticularsApi = async (
  payload,
  setDisabled,
  cb
) => {
  try {
    setDisabled(true);
    await axios.post(
      `${imarineBaseUrl}/domain/ASLLAgency/CreateUpdateExpenseParticulars`,
      payload
    );

    toast.success("Submitted Successfully");
    cb();
    setDisabled(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getExpenseParticularsLandingApi = async (
  category,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  setter([]);
  try {
    const _category = category ? `&Category=${category}` : "";
    const res = await axios.get(
      `${imarineBaseUrl}/domain/ASLLAgency/GetExpenseParticularsLanding?FromDate=${fromDate}&ToDate=${toDate}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${_category}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const getExpenseParticularsById = async (id, setLoading, setter) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/ASLLAgency/GetExpenseParticularsById?expenceId=${id}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
  }
};
