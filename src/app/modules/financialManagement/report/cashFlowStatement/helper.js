import axios from "axios";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getSbuDDLAction = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getCashFlowStatement = async (
  businessUnitId,
  sbuId,
  fromDate,
  toDate,
  setter,
  setLoading,
  enterPriceDivision,
  conversionRate
) => {
  try {
    setLoading(true);
    const res = await axios.get(`/fino/Report/GetCashFlowStatement?BusinessUnitGroup=${enterPriceDivision?.label || ""}&businessUnitId=${businessUnitId}&sbuId=${sbuId}&fromDate=${_dateFormatter(fromDate)}&toDate=${_dateFormatter(toDate)}&ConvertionRate=${conversionRate}`);
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};


