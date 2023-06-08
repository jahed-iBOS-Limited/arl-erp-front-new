import Axios from "axios";
import { toast } from "react-toastify";

export const updateGeneralLedger = async (data, cb) => {
  try {
    await Axios.put(
      `/fino/BusinessTransaction/UpdateGeneralLedger`,
      data
    );
    toast.success("Submitted successfully");
    cb();
  } catch (error) {
    toast.warn("Something went wrong")
    console.log("Error", error.message);
  }
};

export const getGeneralLedgerDDL = async (accId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/fino/FinanceCommonDDL/GetGeneralLedegerDDL?AccountId=${accId}`
    );
    if (res.status === 200) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    console.log("Error", error.message);
  }
};

export const GetLandingComponentData = async (accId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/fino/BusinessTransaction/GetPriceStructureGL?AccountId=${accId}`
    );
    const data = res?.data?.map((item) => ({
      ...item,
      selectedGeneralLeadger: item?.generalLedgerId
        ? { value: item?.generalLedgerId, label: item?.generalLedgerName }
        : "",
    }));
    setter(data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    console.log("Error", error.message);
  }
};
