import axios from "axios";
import Axios from "axios";
import { toast } from "react-toastify";

export const GetTransportSheduleNUnshedule_api = async (
  status,
  buId,
  fromDate,
  toDate,
  fromTime,
  toTime,
  DChannelId,
  shipPointId,
  setter,
  territoryId,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/CodeGenerate/GetTransportSheduleNUnshedule?PartID=${status}&UnitID=${buId}&Fromdate=${fromDate}&Todate=${toDate}&shippointid=${shipPointId}&Territoryid=${territoryId}&DistributionChannelId=${DChannelId}&FromTime=${fromTime}&ToTime=${toTime}`
      // `/oms/CodeGenerate/GetTransportSheduleNUnshedule?PartID=&UnitID=&Fromdate=&Todate=&shippointid=&Territoryid=`
    );
    if (res?.data?.length === 0) toast.warning("Data Not Found");
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const getTerritoryList = async (accId, buId, channelId, setter) => {
  try {
    const res = await axios.get(
      `/partner/BusinessPartnerSales/GetRTMTerritory?AccountId=${accId}&BusniessUnitId=${buId}&ChannelId=${channelId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getDistributionChannelDDL_api = async (accId, buId, setter) => {
  try {
    let res = await Axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};
