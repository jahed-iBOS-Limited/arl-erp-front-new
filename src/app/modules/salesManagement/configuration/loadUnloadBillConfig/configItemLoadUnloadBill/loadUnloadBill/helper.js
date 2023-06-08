import Axios from "axios";
import { toast } from "react-toastify";

export const GetLoadUnloadBillPagination = async (
  accountId,
  buId,
  ShipPointId,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/item/ItemSales/GetLoadUnloadBillConfigLandingPasignation?AccountId=${accountId}&BusinessUnitId=${buId}&ShipPointId=${ShipPointId}&PageNo=${pageNo}&PageSize=${pageSize}&ViewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false);
      setter(res?.data);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getItemTypeListDDL_api = async (setter) => {
  try {
    const res = await Axios.get(
      `/item/ItemCategory/GetItemTypeListDDL
      `
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      const newData = data.map((item) => {
        return {
          value: item.itemTypeId,
          label: item.itemTypeName,
        };
      });
      setter(newData);
    }
  } catch (error) {}
};

export const getItemNameDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/item/ItemSales/GetItemSalesDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const creata_Api = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(`/item/ItemSales/CreateLoadUnload`, data);
    if (res.status === 200) {
      setDisabled(false);
      toast.success(res.data?.message || "Submitted successfully");
      cb();
    }
  } catch (error) {
    setDisabled(false);

    toast.error(error?.response?.data?.message);
  }
};

export const getShipPointDDL = async (accountId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${accountId}&businessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetLoadUnloadView = async (
  accId,
  buId,
  itemId,
  setter,
  setDisabled
) => {
  try {
    setDisabled && setDisabled(true);
    const res = await Axios.get(
      `/item/ItemSales/GetLoadUnloadByItemId?itemId=${itemId}&AccountId=${accId}&BusinessUnitId=${buId}
      `
    );
    setDisabled && setDisabled(false);
    if (res.status === 200) {
      const {
        shipPointId,
        shipPointName,
        itemName,
        itemId,
        unloadAmount,
        loadAmount,
        quantity,
        id,
        vehicleCapacityId,
        vehicleCapacityName,
      } = res?.data[0];

      const newData = {
        intId: id,
        shipPoint: { value: shipPointId, label: shipPointName },
        itemName: { value: itemId, label: itemName },
        quantity: quantity,
        loadAmount: loadAmount,
        unloadAmount: unloadAmount,
        vehicleCapacity: vehicleCapacityId
          ? { value: vehicleCapacityId, label: vehicleCapacityName }
          : "",
      };
      setter(newData);
    }
  } catch (error) {
    setDisabled && setDisabled(false);
  }
};

export const edit_API = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/item/ItemSales/EditLoadUnloadSingle`, data);
    if (res.status === 200) {
      setDisabled(false);
      toast.success(res.data?.message || "Edited successfully");
    }
  } catch (error) {
    setDisabled(false);

    toast.error(error?.response?.data?.message);
  }
};
