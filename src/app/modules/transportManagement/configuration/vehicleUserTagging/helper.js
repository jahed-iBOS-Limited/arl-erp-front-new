import Axios from "axios";
import { toast } from "react-toastify";
export const GetVehicleDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/Vehicle/GetCompanyVehicleDDL?AccountId=${accId}&BusinessUnitId=${buId}&OwnerTypeId=1`
    );
    setter(res?.data);
  } catch (error) {}
};

export const GetVehicleNUserInformation_api = async (
  buId,
  vehicleId,
  empId,
  reportType,
  reportviewBy,
  setter,
  setDisabled
) => {
  try {
    setDisabled && setDisabled(true);
    const res = await Axios.get(
      `/tms/InternalTransport/GetVehicleNUserInformation?ReportType=${reportType}&BusinessUnitID=${buId}&VehicleID=${vehicleId ||
        0}&EmployeeID=${empId || 0}&ReportviewBy=${reportviewBy}`
    );
    if (res.status === 200 && res?.data) {
      setDisabled && setDisabled(false);
      res?.data?.length === 0 && toast.warning("Data not found");
      setter(res?.data);
    }
  } catch (error) {
    setDisabled && setDisabled(false);
    setter([]);
  }
};

export const UpdateVehicleTaggingEntry_api = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/tms/VehicleTaggingByEmployee/VehicleTaggingEntry`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};
