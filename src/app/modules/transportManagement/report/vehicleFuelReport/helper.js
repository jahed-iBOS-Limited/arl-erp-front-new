import axios from "axios";

export const getVehicleDDL = async (accId, buId, ownerType, setter) => {
  try {
    const res = await axios.get(
      `/tms/Vehicle/GetCompanyVehicleDDL?AccountId=${accId}&BusinessUnitId=${buId}&OwnerTypeId=${ownerType}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getVehicleFuelReportData = async (
  accId,
  buId,
  fromDate,
  toDate,
  vId,
  shipPointId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/tms/TMSReport/VehicleFuelCostReport?vehicleId=${vId}&accountId=${accId}&businessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&shipPointId=${shipPointId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
