import Axios from "axios";

export const getCastingScheduleAllData_api = async ({
  formDate,
  toDate,
  status,
  buiId,
  shipPointId,
  pageNo,
  pageSize,
  setLoading,
  setter,
}) => {
  console.log("from helper", pageNo, pageSize);
  try {
    setLoading(true);
    const res = await Axios.get(
      `/oms/CastingSchedule/GetCastingScheduleAllData?FromDate=${formDate}&ToDate=${toDate}&BusinessUnitId=${buiId}&ShippingpointId=${shipPointId}&StatusId=${status}&PageSize=${pageSize}&PageNo=${pageNo}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getShippointDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const newData = res?.data;
      setter(newData);
    }
  } catch (error) {}
};
