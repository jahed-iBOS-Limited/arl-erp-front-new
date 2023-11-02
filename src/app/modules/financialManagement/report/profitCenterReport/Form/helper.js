import axios from "axios";

export const getProfitCenterDDL = async (buId, setter) => {
    try {
      const res = await axios.get(
        `/fino/CostSheet/ProfitCenterDDL?BUId=${buId}`
      );
      if (res.status === 200 && res?.data) {
        const DDLData = [{ value: 0, label: "All" }, ...res?.data];
        setter(DDLData);
      }
    } catch (error) {}
  };

  export const getProfitCenterData = async ({
    controllingUnitId,
    profitCenterGroupId,
    pcId,
    fromDate,
    toDate,
    buId,
    setter
  }) => {
    try {
      const res = await axios.get(
        // /financial-management/report/profitCenterReport
        // `/fino/CostSheet/ProfitRPT?ProfitCenterId=${profitCenterId}&BUId=${buId}`
        `/fino/CostSheet/ProfitReport?PcId=${pcId}&ControlUnitId=${controllingUnitId}&ProficCenterGroupId=${profitCenterGroupId}&Buid=${buId}&FromDate=${fromDate}&Todate=${toDate}`
      );
      if (res.status === 200 && res?.data) {
        setter(res?.data?.Result);
      }
    } catch (error) {}
  };


  export const getProfitCenterReconcileReport = ({  getReconcileDto, selectedBusinessUnit, setReconcileDto, values }) => {
    getReconcileDto(`/fino/CostSheet/ProfitReport?ControlUnitId=0&ProficCenterGroupId=0&Buid=${selectedBusinessUnit?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`, (data) => {
      setReconcileDto(Array.isArray(data?.Result) ? data?.Result : []);
    });
  };
