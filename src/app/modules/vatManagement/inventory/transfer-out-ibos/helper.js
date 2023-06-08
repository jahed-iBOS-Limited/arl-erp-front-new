import Axios from "axios";
import { toast } from "react-toastify";

//Get Tax Branch DDL
export const getTaxBranchDDL = async (userId, accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${buid}&OrgUnitTypeId=15`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getInventoryTransferDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/ItemTransferOut/GetInventoryTransferDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

// create api
export const createItemTransferOutIbos = async (
  data,
  cb,
  setDisabled,
  getInventoryTransferDDL
) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/vat/TaxItemTransferOutIbos/CreateItemTransferOutIbos`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
      getInventoryTransferDDL();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const GetTransferOutPagination = async (
  accId,
  buId,
  taxBranchId,
  itemTypeId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search,
  fromDate,
  toDate
) => {
  try {
    setLoading(true);
    const searchPath = search ? `Search=${search}&` : "";
    const res = await Axios.get(
      `/vat/TaxItemTransferOutIbos/GetItemTransferOutSearchPaginationIbos?${searchPath}accountId=${accId}&businessUnitId=${buId}&taxBranchId=${taxBranchId}&ItemTypeId=${itemTypeId}&status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&fromDate=${fromDate}&toDate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.data?.length > 0) {
        setter(res?.data);
      }
      setLoading(false);
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
// get vat adjustment by id
export const getItemTransferOutById = async (
  taxTransId,
  itemtypeid,
  setter,
  setLoading
) => {
  console.log(taxTransId, "2")
  try {
    setLoading && setLoading(true);
    const res = await Axios.get(
      `/vat/ItemTransferOut/GetItemTransferOutById?taxSalesId=${taxTransId}&itemtypeid=${itemtypeid}`
    );
    if (res.status === 200 && res?.data) {
      const modifiedData = res?.data?.getByIdRow?.map((itm) => ({
        ...itm,
        quantity: Number(itm?.quantity.toFixed(2)),
        baseTotal: Number(itm?.baseTotal.toFixed(2)),
        vatTotal: Number(itm?.vatTotal.toFixed(2)),
      }));
      if (res?.data?.getByIdRow?.length === 0) toast.warning("Item Data found");
      setter({
        ...res?.data,
        getByIdRow: modifiedData,
      });
      setLoading && setLoading(false);
    }
  } catch (error) {
    setter({});
  }
};

export const getEmployeeDesination = async (userId, setDesinationName, cb) => {
  try {
    const res = await Axios.get(
      `/hcm/EmployeeBasicInformation/GetEmployeeBasicInfoById?EmployeeId=${userId}`
    );
    if (res.status === 200 && res?.data) {
      setDesinationName(res?.data[0]?.designationName);
      cb();
    }
  } catch (error) {
    console.log(error.message);
  }
};

// edit vat adjustment
export const editVatAdjustment = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/vat/VatAdjustment/EditVatAdjustment`, data);
    if (res.status === 200) {
      toast.success(res?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};
export const GetItemDDLForLanding = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTaxItemTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getBranchName_api = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=15`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetToBranchDDL_api = async (accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetTaxBranchDDL?AccountId=${accid}&BusinessUnitId=${buid}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetDistributionChannelDDL = async (accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accid}&BUnitId=${buid}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
