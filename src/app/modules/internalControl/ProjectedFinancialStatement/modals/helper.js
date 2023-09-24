import axios from "axios";

export const getAdjustmentJournalView = async (
  adId,
  typeId,
  buId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/fino/AdjustmentJournal/GetAdjustmentJournalByIdForReportForIncomeStatement?adjustmentJournalId=${adId}&accountingJournalTypeId=${typeId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && Array.isArray(res?.data)) {
      setLoading(false);
      const data = res?.data?.[0];
      setter(data);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getBankJournalView = async (
  bjId,
  hdId,
  buId,
  setter,
  setLoading,
  headerData
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/fino/CommonFino/${
        headerData?.fromWhere === "incomeStatement"
          ? `GetBankJournalReportForIncomeStatement`
          : `GetBankJournalReport`
      }?JournalId=${bjId}&AccountingJournalTypeId=${hdId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false);
      setter(res?.data);
    }
  } catch (error) {
    setLoading(false);
  }
};
