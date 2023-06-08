import Axios from "axios";
// import { toast } from "react-toastify";
// import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getBankJournalView = async (journalId,journalTypeId, buId, setter,setLoading) => {
  try {
    setLoading(true)
    const res = await Axios.get(
      `/fino/CommonFino/GetBankJournalReport?JournalId=${journalId}&AccountingJournalTypeId=${journalTypeId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false)
      setter(res?.data);
    }
  } catch (error) {
    setLoading(false)
  }
};









