import axios from "axios";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _todayDate } from "../../../_helper/_todayDate";
// import { toast } from "react-toastify";

export const getAssetSchedule = async (
  dteFrom,
  dteTo,
  buId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      // `/fino/Account/AssetSchedule?UnitId=${buId}&dteFrom=${dteFrom}&dteTo=${dteTo}`
      `/fino/Report/GetAssetSchedule?businessUnitId=${buId}&dteFromDate=${dteFrom}&dteToDate=${dteTo}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (err) {
    setLoading(false);
  }
};

export const getAccountClassDDL = async (accId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/GeneralLedger/GetAccountClassDDL?AccountId=${accId}`
    );
    setter(res?.data);
  } catch (err) {
    console.log(err);
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

export const getBusinessUnitYearConfigData = async (
  accountId,
  businessUnitId,
  initData,
  setter
) => {
  try {
    const res = await axios.get(
      `/fino/FinanceCommonDDL/GetBusinessUnitYearConfigData?accountId=${accountId}&businessUnitId=${businessUnitId}`
    );
    setter({
      balanceType: "3",
      toDate: _todayDate(),
      fromDate: res?.data?.[0]["startDate"]
        ? _dateFormatter(res?.data?.[0]["startDate"])
        : _dateFormatter(new Date()),
    });
    setter(res?.data);
  } catch (err) {
    console.log(err);
  }
};

// accId=1,busId=2,gl=94 category =15,33 class =15
