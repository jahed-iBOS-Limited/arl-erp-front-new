import Axios from "axios";
// import { toast } from "react-toastify";
// import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getBankJournalView = async (bjId,hdId, buId, setter,setLoading, headerData) => {
  try {
    setLoading(true)
    const res = await Axios.get(
      `/fino/CommonFino/${headerData?.fromWhere === "incomeStatement" ? `GetBankJournalReportForIncomeStatement`:`GetBankJournalReport`}?JournalId=${bjId}&AccountingJournalTypeId=${hdId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false)
      setter(res?.data);
    }
  } catch (error) {
    setLoading(false)
  }
};









