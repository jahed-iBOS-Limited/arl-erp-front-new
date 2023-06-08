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
export const getPendingShippingReportLandingData = async (
  accId,
  buId,
  // whId,
  disId,
  region,
  area,
  terId,
  partnerId,
  fromDate,
  toDate,
  shipmentId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true)
  try {
    let res = await axios.get(
      `/oms/Shipment/GetDataOfDeliveriesByTerriroryId?AccountId=${accId}&BusinessUnitId=${buId}&ShipPointId=${shipmentId}&DistributionChannel=${disId}&Region=${region}&Area=${area}&TerritoryId=${terId}&PartnerId=${partnerId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setLoading && setLoading(false)
    setter(res?.data);
  } catch (err) {
    setLoading && setLoading(false)
    setter([]);
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
