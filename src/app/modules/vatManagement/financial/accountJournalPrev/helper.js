import axios from "axios";
import { toast } from "react-toastify";

export const getAccountJournalLandingData = async (
  accId,
  buId,
  sbuId,
  journalTypeId,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/fino/TransferJournalToTaxAcc/GetTransferJournalTAXLanding?AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}&AccountingJournalTypeId=${journalTypeId}&fromdate=${fromDate}&Todate=${toDate}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
    setLoading(false);
  }
};
