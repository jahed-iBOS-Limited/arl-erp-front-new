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
    const res = await axios.get(
      `/fino/Report/GetCashFlowStatement?BusinessUnitGroup=${enterPriceDivision?.label ||
        ""}&businessUnitId=${businessUnitId}&sbuId=${sbuId}&fromDate=${_dateFormatter(
        fromDate
      )}&toDate=${_dateFormatter(toDate)}&ConvertionRate=${conversionRate}`
    );

    const resNumAmountFromProjectedApi = await axios.get(
      `/fino/Report/GetCashFlowStatementProjected?BusinessUnitGroup=${enterPriceDivision?.label ||
        ""}&businessUnitId=${businessUnitId}&sbuId=${sbuId}&fromDate=${_dateFormatter(
        fromDate
      )}&toDate=${_dateFormatter(toDate)}&ConvertionRate=${conversionRate}`
    );
    const filterGetData = resNumAmountFromProjectedApi?.data;
    const modifiedData = res?.data?.map((item, index) => {
      return {
        ...item,
        numPlannedAmount:
          item.intSl === filterGetData[index].intSl
            ? filterGetData[index].numAmount
            : 0,
      };
    });

    console.log("res data", res?.data);
    console.log("filterGetData", filterGetData);
    console.log("modifiedData", modifiedData);

    setLoading(false);
    setter(modifiedData);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};
