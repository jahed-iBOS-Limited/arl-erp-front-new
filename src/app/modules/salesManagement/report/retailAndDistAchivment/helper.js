import axios from "axios";
import { toast } from "react-toastify";

export const getAchievementReports = async (
  values,
  accId,
  buId,
  setter,
  setLoading
) => {
  setLoading(true);
  const url =
    values?.reportType?.value === 1
      ? `/oms/OMSPivotReport/GetRetailAndDistributorIncreaseAchievement?AccountId=${accId}&BusinessUnit=${buId}&MonthId=${values?.month?.value}&YearId=${values?.year?.value}&TypeId=${values?.type?.value}`
      : `/oms/SalesInformation/getOperationalSetupNSalesCollectionBG?intPartId=${values?.reportType?.value}&fromdate=${values?.fromDate}&todate=${values?.toDate}&intunitid=${buId}&avgProductPrice=${values?.avgProductPrice}&allowbgRate=${values?.allowBgRate}`;
  try {
    const res = await axios.get(url);
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

// Not Binded
export const getNetToCompanyData = async (values, buId, setter, setLoading) => {
  setLoading(true);
  const partId = values?.reportType?.value;
  const ShipPointId = values?.shippointDDL?.value;
  const fromDate = values?.fromDate;
  const toDate = values?.toDate;
  const channelId = values?.channel?.value;
  const customerId = values?.customerNameDDL?.value;
  const tradeCom = values?.tradeCommission;
  const rate = values?.yearlyRate;

  const url = `/oms/SalesInformation/GetDealerDistributorBenefit?intpartid=${partId}&ShipPointId=${ShipPointId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&intDistributionChannel=${channelId}&intCustomerid=${customerId}&numtradeCommission=${tradeCom}&numYearlyRate=${rate}`;

  try {
    const res = await axios.get(url);
    const modifyData = res?.data?.map((item) => {
      const FactTransPortCostWithCommission =
        item?.numPerbagCommission + item?.numFactoryTransportCostRate;
      const GhatTransPortCostWithCommission =
        item?.numPerbagCommission +
        item?.numGhatTransportCostRate +
        item?.AvgGhatTransferRate;
      const transportandcommissonavg =
        (FactTransPortCostWithCommission + GhatTransPortCostWithCommission) / 2;
      const netToCompany = item?.numLandingPricePCC - transportandcommissonavg;
      return {
        ...item,
        FactTransPortCostWithCommission: FactTransPortCostWithCommission,
        GhatTransPortCostWithCommission: GhatTransPortCostWithCommission,
        transportandcommissonavg: transportandcommissonavg,
        NettoCompany: netToCompany,
      };
    });
    setter(modifyData);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getUserLoginInfo = async (accId, buId, empId, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/hcm/RemoteAttendance/GetEmployeeLoginInfo?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${empId}`
    );
    cb(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
