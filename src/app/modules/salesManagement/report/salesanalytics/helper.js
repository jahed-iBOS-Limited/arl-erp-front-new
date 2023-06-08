import Axios from "axios";
import { toast } from "react-toastify";
import { _todayDate } from "./../../../chartering/_chartinghelper/_todayDate";

export const getTargetVSSaelsAchievement_api = async ({
  accId,
  buId,
  values,
  setLoading,
  setter,
}) => {
  try {
    setLoading(true);
    let monthId = values?.month?.value,
      yarId = values?.year?.value,
      fromDate = values?.fromDate || _todayDate(),
      toDate = values?.toDate || _todayDate();
    if (+values?.reportType?.value === 9) {
      let date = new Date(toDate);
      monthId = date.getMonth() + 1;
      yarId = date.getFullYear();
    }

    const channelId = values?.channel?.value || 0;
    const regionId = values?.region?.value || 0;
    const areaId = values?.area?.value || 0;
    const territoryId = values?.territory?.value || 0;

    const res = await Axios.get(
      `/oms/SalesInformation/GetTargetVSSaelsAchievement?AccountId=${accId}&BusinessunitId=${buId}&MonthId=${monthId}&YearId=${yarId}&PartNo=${values?.reportType?.value}&FromDate=${fromDate}&ToDate=${toDate}&intChannelID=${channelId}&intRegionID=${regionId}&intAreaID=${areaId}&intTerritoryID=${territoryId}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getNeedToCompany_api = async ({
  accId,
  buId,
  values,
  _pageNo,
  _pageSize,
  setLoading,
  setter,
}) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/oms/SalesOrder/GetNeedToCompany?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&PageNo=${_pageNo}&PageSize=${_pageSize}&viewOrder=desc`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
export const getSalesDelivaryCost_api = async ({
  accId,
  buId,
  values,
  _pageNo,
  _pageSize,
  setLoading,
  setter,
}) => {
  try {
    setLoading(true);
    const channelId = values?.channel?.value || 0;
    const regionId = values?.region?.value || 0;
    const areaId = values?.area?.value || 0;
    const territoryId = values?.territory?.value || 0;
    const fromDate = values?.fromDate;
    const toDate = values?.toDate;

    const res = await Axios.get(
      `/oms/SalesOrganization/GetSalesDelivaryCost?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}&RegionId=${regionId}&AreaId=${areaId}&TerritoryId=${territoryId}&FromDate=${fromDate}&ToDate=${toDate}&PageNo=${_pageNo}&PageSize=${_pageSize}&viewOrder=desc`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getCommissionCalculationData = async (
  buId,
  shipPointId,
  channelId,
  customerId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/SalesInformation/getComissionCalCulation?intpartid=10&ShipPointId=${shipPointId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&intDistributionChannel=${channelId}&intCustomerid=${customerId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
