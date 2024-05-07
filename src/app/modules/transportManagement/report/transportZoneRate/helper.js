import axios from "axios";
import Axios from "axios";
import { toast } from "react-toastify";

export const getSalesOrderReportData = async (
  accId,
  buId,
  fromDate,
  toDate,
  isBillSubmited,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/tms/TMSReport/GetShipmentExpenseDetails?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&isBillSubmited=${isBillSubmited}`
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
  shipmentId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/tms/TMSReport/GetTransportZoneRate?AccountId=${accId}&BusinessUnitID=${buId}&ShippointId=${shipmentId}`
    );
    if (res.status === 200 && res?.data) {
      const modifiedData = res?.data?.map((item) => {
        const totalRate =
          item?.factoryToGhatTransferRate +
          item?.num7tonRate +
          // item?.handlingCost +
          item?.labourCost +
          item?.subsidyCostRate;
        return {
          ...item,
          totalRate,
        };
      });
      const sortedData = modifiedData?.sort(
        (a, b) => b?.totalRate - a?.totalRate
      );
      setter(sortedData);
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

export const getZoneCostReportById = async (zoneCostId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/tms/ShipmentCostRate/GetShipmentCostRateById?zoneCostId=${zoneCostId}`
    );
    const payload = {
      zone: {
        value: res?.data?.zoneId,
        label: res?.data?.zoneName,
      },
      shipPoint: {
        value: res?.data?.shipPointId,
        label: res?.data?.shipPointName,
      },
      ...res?.data,
    };
    setter(payload);
    setLoading(false);
  } catch (error) {
    setter("");
    setLoading(false);
  }
};

export const EditTransportZoneRate = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/tms/ShipmentCostRate/EditShipmentCostRate`,
      payload
    );
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error.message);
    setLoading(false);
  }
};
