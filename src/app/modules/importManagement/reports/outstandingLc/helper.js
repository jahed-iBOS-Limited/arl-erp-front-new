import axios from "axios";
import { toast } from "react-toastify";

export const GetOutstandingLCReport = async (accId, businessUnit, setter, setLoader) => {
  setLoader(true);
  try {
    const res = await axios.get(
      `/imp/ImportReport/GetOutstandingLCReport?accountId=${accId}&businessUnitId=${businessUnit}`
    );
    setter(res?.data);
    setLoader(false);
  } catch (err) {
    setLoader(false);
    toast.warning(err?.response?.data?.message);
  }
};

//Get Business Unit
export const GetBusinessUnitDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/imp/ImportCommonDDL/GetBusinessUnitDDL?accountId=${accId}`
    );

    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

// Get Customs Name DDL
export const GetBankListForOutstandingLCReport = async (
  accId,
  businessUnitId,
  setter
) => {
  try {
    let res = await axios.get(
      `/imp/ImportCommonDDL/GetBankListForOutstandingLCReport?accountId=${accId}&businessUnitId=${businessUnitId}`
    );

    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};
