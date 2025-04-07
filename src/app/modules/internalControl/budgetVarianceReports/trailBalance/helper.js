import axios from 'axios';
import { _todayDate } from '../../../_helper/_todayDate';
import { _dateFormatter } from '../../../_helper/_dateFormate';

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
      `/fino/TrailBalanceReport/GetTrailBalanceByPamsReport?AccountId=${accId}&BusinessUnitId=${buId}&StartDate=${startDate}&EndDate=${endDate}&ViewType=${balanceType}`
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
      balanceType: '3',
      toDate: _todayDate(),
      fromDate: res?.data?.[0]['startDate']
        ? _dateFormatter(res?.data?.[0]['startDate'])
        : _dateFormatter(new Date()),
    });
    setter(res?.data);
  } catch (err) {
    console.log(err);
  }
};
