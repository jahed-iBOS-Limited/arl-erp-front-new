import axios from 'axios';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import { _todayDate } from '../../../_helper/_todayDate';
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
