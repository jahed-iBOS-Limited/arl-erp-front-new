import Axios from "axios";
import { toast } from "react-toastify";

export const getTaxSalesReport_api = async (
  buId,
  itemId,
  shippointId,
  fromDate,
  toDate,
  customerId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    // modify api for all business unit & e akij cement
    let api = {
      akijCement: `/oms/OMSPivotReport/GetTaxSalesReportACCL?businessUnitId=${buId}&depoId=${shippointId}&itemId=${itemId}&fromDate=${fromDate}&toDate=${toDate}&customerId=${customerId}`,
      allExceptAkijCement: `/oms/OMSPivotReport/TaxSalesReport?BusinessUnitId=${buId}&ItemId=${itemId}&DepoId=${shippointId}&FromDate=${fromDate}&ToDate=${toDate}&CustomerId=${customerId}`,
    };

    // change 1st api if business unit is cement else 2nd api 
    const res = await Axios.get(
      api[buId === 4 ? "akijCement" : "allExceptAkijCement"]
    );
    if (res?.data?.length === 0) toast.warning("Data not found");
    const result = res?.data?.map((itm) => ({
      ...itm,
      qty: Math.round(itm?.qty),
      rate: Math.round(itm?.rate),
      totalAmount: Math.round(itm?.totalAmount),
    }));
    setter(result);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const GetSellableReportApi = async (
  buId,
  itemId,
  itemTypeId,
  fromDate,
  toDate,
  plantId,
  warehouseId,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/procurement/Report/GetSellableReport?businessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&intPlantId=${plantId}&intItemTypeId=${itemTypeId}&itemId=${itemId}&warehouseId=${warehouseId}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
    if (res?.data?.length === 0) toast.warning("Data not found");
    const result = res?.data?.map((itm) => ({
      ...itm,
      qty: Math.round(itm?.qty),
      rate: Math.round(itm?.rate),
      totalAmount: Math.round(itm?.totalAmount),
    }));
    setter(result);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const getItemDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetTaxItemForSalesDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetBranchDDL = async (accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetTaxBranchDDL?AccountId=${accid}&BusinessUnitId=${buid}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getPartnerNameDDL_api = async (accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${accid}&BusinessUnitId=${buid}&PartnerTypeId=2`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetItemTypeDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTaxItemTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const GetItemNameDDL_api = async (accId, buId, typeId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetTaxItemListByItemTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}&TaxItemTypeId=${typeId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getWarehouseDDL = async (userId, accId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
