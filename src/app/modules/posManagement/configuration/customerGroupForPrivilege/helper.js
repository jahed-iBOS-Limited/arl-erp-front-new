import Axios from "axios";
import { toast } from "react-toastify";

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
    setter(res?.data);
  } catch (error) {}
};

export const getCustomerListByGenderDDL = async (
  accountId,
  businessUnitId,
  genderId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/item/CustomerGroup/GetCustomerListByGender?accountId=${accountId}&businessUnitId=${businessUnitId}&genderId=${genderId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const createCustomerGroupForPrivilege = async (
  data,
  cb,
  setDisabled
) => {
  try {
    setDisabled(true);
    const res = await Axios.post(
      `/item/CustomerGroup/CreateCustomerGroup`,
      data
    );

    toast.success(res?.data?.message || "Submitted successfully");
    cb();
    setDisabled(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getCustomerGroupLandingPasignation = async (
  accountId,
  businessUnitId,
  outletId,
  status,
  pageSize,
  pageNo,
  setter,
  setLoading
) => {
  const statusValue = status === 3 ? '' : `&status=${status}`
  try {
    setLoading(true);
    const res = await Axios.get(
      `/item/CustomerGroup/CustomerGroupLandingPasignation?accountId=${accountId}&businessUnitId=${businessUnitId}&warehouseId=${outletId}${statusValue}&pageSize=${pageSize}&pageNo=${pageNo}&viewOrder=desc`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

export const getCustomerGroupById = async (
  customerGroupId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/item/CustomerGroup/GetCustomerGroupById?customergroupId=${customerGroupId}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getCustomerActiveInactive = async (
  customerGroupId,
  actionBy,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.put(
      `/item/CustomerGroup/CustomerActiveInActive?customerGroupId=${customerGroupId}&actionBy=${actionBy}`
    );
    setLoading(false);
    toast.success(res?.data?.message)
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};
