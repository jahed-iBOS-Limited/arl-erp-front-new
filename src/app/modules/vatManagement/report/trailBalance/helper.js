import axios from 'axios';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import { _todayDate } from '../../../_helper/_todayDate';
// import { toast } from "react-toastify";

export const getTrailBalanceReport = async (
  accId,
  buId,
  startDate,
  endDate,
  balanceType,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/fino/Account/GetTrailBalanceByPamsReport?AccountId=${accId}&BusinessUnitId=${buId}&StartDate=${startDate}&EndDate=${endDate}&ViewType=${balanceType}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (err) {
    setLoading(false);
  }
};

export const getAccountCategoryDDL = async (accId, classId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/GeneralLedger/GetAccountCategoryByClassDDL?AccountId=${accId}&ClassId=${classId}`
    );
    setter(res?.data);
  } catch (err) {
    console.log(err);
  }
};

export const getGeneralLedgerByCategoryDDL = async (
  accId,
  categoryId,
  buId,
  setter
) => {
  try {
    const res = await axios.get(
      `/costmgmt/GeneralLedger/GetGeneralLedgerByCategoryDDL?AccountId=${accId}&GeneralLedgerCategoryId=${categoryId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    console.log(err);
  }
};
