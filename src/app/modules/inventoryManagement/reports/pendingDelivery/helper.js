import axios from "axios";

export const getDistributionChannelDDL = async (accId, buId, sbuId, setter) => {
  try {
    let res = await axios.get(
      `/oms/SalesOrder/GetDistributionChannelDDLBySBUId?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};
export const GetShipPointWarehouseDDL_api = async (
  accId,
  buId,
  shipPointId,
  setter
) => {
  try {
    let res = await axios.get(
      `/wms/ShipPointWarehouse/GetShipPointWarehouseDDL?AccountId=${accId}&BusinessUnitId=${buId}&ShipPointId=${shipPointId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};
export const GetDataOfSalesOrderByTerriroryId_api = async ({
  typeId,
  accId,
  buId,
  warehouseId,
  channelId,
  regionId,
  areaId,
  territoryId,
  soldToPartyId,
  fromDate,
  toDate,
  setter,
  setLoading,  // Add setLoading to the parameters
}) => {
  setLoading && setLoading(true);  // Set loading to true before starting the request

  try {
    const api_one = `/oms/SalesOrder/GetDataOfSalesOrderByTerriroryId?AccountId=${accId}&BusinessUnitId=${buId}&WearHouseId=${warehouseId}&DistributionChannel=${channelId}&Region=${regionId}&Area=${areaId}&TerritoryId=${territoryId}&PartnerId=${soldToPartyId}&FromDate=${fromDate}&ToDate=${toDate}`;

    const api_two = `/oms/SalesOrder/GetPendingDeliveryShipmentByTerrirory?AccountId=${accId}&BusinessUnitId=${buId}&WearHouseId=${warehouseId}&DistributionChannel=${channelId}&Region=${regionId}&Area=${areaId}&TerritoryId=${territoryId}&PartnerId=${soldToPartyId}&FromDate=${fromDate}&ToDate=${toDate}`;

    const URL = typeId === 1 ? api_one : api_two;

    let res = await axios.get(URL);
    setter(
      res?.data?.[0]?.objRow?.map((itm) => ({
        ...itm,
        itemCheck: false,
      }))
    );
  } catch (err) {
    setter([]);
  } finally {
    setLoading && setLoading(false);  // Set loading to false after the request is complete
  }
};


export const getRegionDDL = async (accId, buId, chId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetRegionByChannelIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${chId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getAreaDDL = async (accId, buId, cId, reId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetAreaDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${cId}&RegionId=${reId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getTerritoryDDL = async (accId, buId, cId, aId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetTerritoryDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${cId}&AreaId=${aId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const GetSoldToPartyDDL = async (accId, buId, territoryId, setter) => {
  try {
    let res = await axios.get(
      `/partner/BusinessPartnerSales/GetBusinessPartnerByTerritoryId?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${territoryId}`
    );
    const modifiedData = res?.data?.map((item) => {
      return {
        value: item?.businessPartnerId,
        label: item?.businessPartnerName,
      };
    });
    setter(modifiedData);
  } catch (err) {
    setter([]);
  }
};
