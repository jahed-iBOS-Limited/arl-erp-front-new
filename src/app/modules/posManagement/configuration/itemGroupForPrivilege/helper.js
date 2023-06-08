import Axios from "axios";
import { toast } from "react-toastify";
//DeliveryInquiryReportGrid_api
export const GetItemGroupLanding_api = async (
  accId,
  buId,
  plantId,
  sbuId,
  whId,
  status,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.get(
      `/item/ItemProfile/GetItemGroupLanding?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&SbuId=${sbuId}&WarehouseId=${whId}&IsActive=${status}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setLoading && setLoading(false);
    setter(res?.data);
  } catch (error) {
    setter([]);
    setLoading && setLoading(false);
  }
};

export const getWareHouseDDL = async (
  accountId,
  businessUnitId,
  plantId,
  userId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseRequest/OutletDDLPermissionWise?UserId=${userId}&AccountId=${accountId}&BusinessUnitId=${businessUnitId}&PlantId=${plantId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const GetSalesWiseItem_api = async (
  accountId,
  businessUnitId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/item/ItemProfile/GetSalesWiseItem?AccountId=${accountId}&BusinessUnitId=${businessUnitId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const GetItemGroupById_api = async (id, setter, setLoading) => {
  try {
    setLoading && setLoading(true);
    const res = await Axios.get(
      `/item/ItemProfile/GetItemGroupById?ItemGroupById=${id}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
  }
};

export const saveItemGroupForPrivilege_api = async (data, cb, setDisabled) => {
  try {
    setDisabled(true);
    const res = await Axios.post(`/item/ItemProfile/PostItemGroup`, data);
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const updateItemGroupById_api = async (groupId, status, setDisabled, activeCB, values) => {
  try {
    setDisabled(true);
    const res = await Axios.put(
      `/item/ItemProfile/UpdateItemGroupById?ItemGroupById=${groupId}&Status=${status}`
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      setDisabled(false);
      activeCB(values)
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
