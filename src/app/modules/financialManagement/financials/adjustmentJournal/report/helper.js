import Axios from "axios";
// import { toast } from "react-toastify";
// import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getAdjustmentJournalView = async (adId, buId, setter,setLoading) => {
  try {
    setLoading(true)
    const res = await Axios.get(
      `/fino/AdjustmentJournal/GetAdjustmentJournalByIdForReport?adjustmentJournalId=${adId}&accountingJournalTypeId=7&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && Array.isArray(res?.data)) {
      setLoading(false)
      const data = res?.data?.[0]
      setter(data);
    }
  } catch (error) {
    setLoading(false)
  }
};
