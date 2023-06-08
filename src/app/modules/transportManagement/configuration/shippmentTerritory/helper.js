import Axios from "axios";
import { toast } from "react-toastify";

export const createShippmentTerritory = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/tms/TerritoryInfo/CreateShippingPointTerritory`,
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

export const ShippingPointTerritoryLanding = async (
  shippointId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/tms/TerritoryInfo/ShippingPointTerritoryLanding?ShippointId=${shippointId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};


// InActive
export const inActiveShippointTerritory = async (data, setDisabled, cb) => {
  console.log(data);
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/tms/TerritoryInfo/InActiveShippingPointTerritory`, data
    );
    if (res.status === 200) {
      toast.success(res?.data?.message);
      cb();
      setDisabled(false); 
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const getAreaDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/TerritoryInfo/GetAreaDDl?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getShipPointDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};
