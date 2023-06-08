import Axios from "axios";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getSbuDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

// https://localhost:5001/fino/BankBranch/GetAutoReconcileList?BusinessUnitId=164&BankId=1&BankBranch=224&BankAccountId=21&FromDate=2021-1-1&ToDate=2021-8-8
export const getAutoReconcileList = async (
  businessUnitId,
  bankAccountId,
  fromDate,
  toDate,
  search,
  setter
) => {
  try {
    const res = await Axios.get(
      `/fino/BankBranch/GetAutoReconcileList?BusinessUnitId=${businessUnitId}&BankAccountId=${bankAccountId}&FromDate=${_dateFormatter(
        fromDate
      )}&ToDate=${_dateFormatter(toDate)}&search=${search}`
    );
    setter(res?.data);
  } catch (error) {}
};
