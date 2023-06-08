import Axios from "axios";
// import { toast } from "react-toastify";
// import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getTaxAccountingJournal = async (accountingJournalCode,setter,setLoading) => {
  try {
    setLoading(true)
    const res = await Axios.get(
      ///fino/CommonFino/GetTaxAccountingJournal?accountingJournalCode=BR-ACCL-MAR22-1120
      `/fino/CommonFino/GetTaxAccountingJournal?accountingJournalCode=${accountingJournalCode}`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false)
      setter(res?.data);
    }
  } catch (error) {
    setLoading(false)
  }
};









