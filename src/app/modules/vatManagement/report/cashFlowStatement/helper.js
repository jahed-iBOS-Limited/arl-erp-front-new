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
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(`/fino/Accounting/GetCashFlowStatement?businessUnitId=${businessUnitId}&sbuId=${sbuId}&fromDate=${_dateFormatter(fromDate)}&toDate=${_dateFormatter(toDate)}`);
    setLoading(false);
    // res?.data?.forEach(item=>{

    // })
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};


