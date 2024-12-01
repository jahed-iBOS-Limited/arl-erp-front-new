import { default as Axios, default as axios } from "axios";
import moment from "moment";
import { toast } from "react-toastify";

export const GetCustomerStatementLanding = async (
  accId,
  buId,
  values,
  setLoading,
  setter
) => {
  const {
    fromDate,
    // fromTime,
    toDate,
    // toTime,
    customerNameDDL: { value: customerId },
    shippointDDL: { value: shipPointId },
    distributionChannel: { value: channelId },
    salesOrg: { value: salesOrgId },
  } = values;
  const fromDateTime = moment(`${fromDate} ${"00:00"}`).format(
    "YYYY-MM-DDTHH:mm:ss"
  );
  const toDateTime = moment(`${toDate} ${"00:00"}`).format(
    "YYYY-MM-DDTHH:mm:ss"
  );
  try {
    setLoading(true);
    const res = await Axios.get(
      `/oms/OManagementReport/GetCustomerDeliveryStatementModified?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDateTime}&ToDate=${toDateTime}&CustomerId=${customerId}&ShipPointId=${shipPointId}&salesOrgId=${salesOrgId}&DistribuitionChannelId=${channelId}`
    );
    const unique = [
      ...new Map(res?.data?.map((item) => [item["customerId"], item])).values(),
    ];

    if (res?.data?.[0]?.objList?.length > 0) {
      setter(unique);
    } else {
      toast.warning("Data not found");
      setter([]);
    }

    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const getCustomerNameDDL = async (
  accId,
  buId,
  orgId,
  distributionChannelId,
  setter
) => {
  let distributorStr =
    distributionChannelId === 0
      ? ""
      : `&DistribuitionChannelId=${distributionChannelId}`;

  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetCustomerNameBySalesOrgDDL?AccountId=${accId}&BusinessUnitId=${buId}&SalesOrganization=${orgId}${distributorStr}`
    );
    const modifiedData = [{ value: 0, label: "All" }, ...res?.data];
    setter(modifiedData);
  } catch (error) {
    setter([]);
  }
};

export const getDistributionDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );

    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const GetSalesOrganizationDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/SalesOrganization/GetSalesOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getCustomerStatementTopSheet = async (
  accId,
  buId,
  fromDate,
  toDate,
  customerId,
  shipPointId,
  salesOrgId,
  channelId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      // `/oms/OManagementReport/GetCustomerDeliveryStatementTopSheet?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&CustomerId=${customerId}&ShipPointId=${shipPointId}&salesOrgId=${salesOrgId}&DistribuitionChannelId=${channelId}`
      `/oms/SalesInformation/getcustomerDeliverystatementOSBase?intpartid=14&ShipPointId=${shipPointId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&intDistributionChannel=${channelId}&intCustomerid=${customerId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
export const getCustomerStatementItemBasis = async (
  accId,
  buId,
  fromDate,
  toDate,
  customerId,
  shipPointId,
  salesOrgId,
  channelId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      // `/oms/OManagementReport/GetCustomerDeliveryStatementTopSheet?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&CustomerId=${customerId}&ShipPointId=${shipPointId}&salesOrgId=${salesOrgId}&DistribuitionChannelId=${channelId}`
      `/oms/SalesInformation/getcustomerDeliverystatementOSBase?intpartid=6&ShipPointId=${shipPointId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&intDistributionChannel=${channelId}&intCustomerid=${customerId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getRegionAreaTerritory = async ({
  channelId,
  regionId,
  areaId,
  setter,
  setLoading,
  value,
  label,
  territoryId,
}) => {
  setLoading(true);
  const region = regionId ? `&regionId=${regionId}` : "";
  const area = areaId ? `&areaId=${areaId}` : "";
  const territory = territoryId ? `&territoryId=${territoryId}` : "";
  try {
    const res = await axios.get(
      `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${channelId}${region}${area}${territory}`
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        value: item[value],
        label: item[label],
      }))
    );
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
