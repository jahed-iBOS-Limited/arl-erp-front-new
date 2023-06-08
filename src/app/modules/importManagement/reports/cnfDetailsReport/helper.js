import axios from "axios";
import { toast } from "react-toastify";

export const CNFDetailsReport = async (accId, businessUnit, fromDate, toDate, setter, setLoader) => {
  setLoader(true);
  try {
    const res = await axios.get(
      `/imp/ImportReport/CNFDetailsReport?accountId=${accId}&businessUnitId=${businessUnit}&fromDate=${fromDate}&toDate=${toDate}`
    );
    setter(res?.data);
    setLoader(false);
  } catch (err) {
    setLoader(false);
    toast.warning(err?.response?.data?.message);
  }
};

//Get Business Unit
export const GetBusinessUnitDDL = async (accId, setter) => {
  try {
    let res = await axios.get(
      `/imp/ImportCommonDDL/GetBusinessUnitDDL?accountId=${accId}`
    );

    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};