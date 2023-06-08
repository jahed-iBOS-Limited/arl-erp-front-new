import Axios from "axios";
import { toast } from "react-toastify";

export const getSalesOrderReportData = async (
  accId,
  buId,
  fromDate,
  toDate,
  isBillSubmitted,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/tms/TMSReport/GetShipmentExpenseDetails?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&isBillSubmited=${isBillSubmitted}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length > 0) {
        setter(res?.data);
      } else {
        toast.warning("No Data Found");
      }
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const GetSupplierFuelStationDDL_api = async (
  partnerId,
  accId,
  buId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetSupplierFuelStationDDL?PartnerId=${partnerId}&AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getLandingData = async (
  accId,
  buId,
  fromDate,
  toDate,
  stationId,
  typeId,
  shipmentId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/tms/FuelCostInfo/GetFuelCostReport?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&FuelStation=${stationId}&FuelType=${typeId}&shipPointId=${shipmentId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getSupplierDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${accId}&UnitId=${buId}&SBUId=0`
    );

    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetVehicleFuelTypeDDL_api = async (setter) => {
  try {
    const res = await Axios.get(
      `/tms/Vehicle/GetVehicleFuelTypeDDL?IsActive=true`
    );
    const modifiedData = [{ value: 0, label: "All" }, ...res?.data];
    setter(modifiedData);
  } catch (error) {
    setter([]);
  }
};
