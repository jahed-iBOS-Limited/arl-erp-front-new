import axios from "axios";
import { toast } from "react-toastify";

export const getVehicleLogPurchaseDetails = async (
  accId,
  buId,
  vehicleId,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/tms/VehicleLogBook/getVechiclelogFuelPurchesDetails?businessId=${buId}&accountId=${accId}&VehicleId=${vehicleId}&fromDate=${fromDate}&todate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const GetVehicleDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/tms/Vehicle/GetCompanyVehicleDDL?AccountId=${accId}&BusinessUnitId=${buId}&OwnerTypeId=1`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const deleteFuelLog = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/tms/VehicleLogBook/deleteVechiclelogFuelPurchesDetails?vechicleLogid=${payload?.vehicleLogId}&IntFuelPurchaseId=${payload?.fuelPurchaseId}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
