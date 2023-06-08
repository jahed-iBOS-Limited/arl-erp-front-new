import Axios from "axios";
import { toast } from "react-toastify";

// Item Type-in Create api's
// get tax branch ddl
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
// get business unit ddl
export const getBusinessUnitByAccIdDDL = async (accId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetBusinessUnitByAccIdDDL?AccountId=${accId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
// Item Name With Code Uom DDL
export const getItemNameWithCodeUomDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/ItemNameWithCodeUomDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
// tax item group ddl
export const getTaxItemGroupDDL = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTaxItemGroupDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
//create transer in
export const createItemTransferIn = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/vat/ItemTransferIn/CreateItemTransferIn`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
// transfer in pagination
export const getItemTransferInPagination = async (
  itemTypeId,
  accId,
  buId,
  taxBranchId,
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
      `/vat/ItemTransferIn/GetItemTransferInSearchPagination?${searchPath}ItemType=${itemTypeId}&accountId=${accId}&businessUnitId=${buId}&status=true&taxBranchId=${taxBranchId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&fromDate=${fromDate}&toDate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};
//edit transfer in
export const editItemTransferIn = async (data, cb) => {
  try {
    const res = await Axios.put(`/vat/ItemTransferIn/EditItemTransferIn`, data);
    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully");
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
// item type ddl

export const getTaxItemTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTaxItemTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
// transfer no. api

export const salesInvoiceByBranchIdDDL = async (
  accId,
  buId,
  taxBranchId,
  itemTypeId,
  setter,
  setDisabled
) => {
  setDisabled && setDisabled(true)
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/TransferInvoiceByBranchIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&TaxBranchId=${taxBranchId}&ItemType=${itemTypeId}`
    );
    setDisabled && setDisabled(false)
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([])
    setDisabled && setDisabled(false)
  }
};

// create page right grid data
export const getDeliveryDetailsById = async (
  itemTypeId,
  taxSalesId,
  setter,
  setFieldValue
) => {
  // taxSalesId,
  try { 
    const res = await Axios.get(
      `/vat/ItemTransferIn/GetItemTransferInById?ItemTypeId=${itemTypeId}&Id=${taxSalesId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setFieldValue("otherBranchName", {
        value: res.data?.getByIdHeader?.taxBranchId,
        label: res.data?.getByIdHeader?.taxBranchName,
      });
      setFieldValue(
        "otherBranchAddress",
        res.data?.getByIdHeader?.taxBranchAddress
      );
    }
  } catch (error) {}
};
// tax sales by id
export const getTaxSalesById = async (taxSalesId, setter, setDisabled) => {
  try {
    setDisabled && setDisabled(true);
    const res = await Axios.get(
      `/vat/ItemTransferIn/GetTaxSalesById?TaxSalesId=${taxSalesId}`
    );
    const newRow = res?.data?.getByIdRow;
    const newRowData = newRow?.map((item) => ({
      taxItemGroupId: item?.taxItemGroupId,
      taxItemGroupName: item?.taxItemGroupName,
      uomid: item?.uomid,
      uomname: item?.uomname,
      quantity: item?.quantity,
      basePrice: Math.abs(item?.basePrice),
      purchaseDateTime:  res?.data?.getByIdHeader?.deliveryDateTime 
    }));
    setter(newRowData);
    setDisabled && setDisabled(false);
  } catch (error) {
    setDisabled && setDisabled(false);
  }
};

// purchase sales by id
export const getPurchaseSalesById = async (taxSalesId, setter, setDisabled) => {
  setDisabled && setDisabled(true);
  try {
    const res = await Axios.get(
      `/vat/TaxPurchase/GetTaxPurchaseById?TaxPurchaseId=${taxSalesId}`
    );
      const newRow = res?.data?.objListRowDTO;
      const newRowData = newRow?.map((item) => ({
        taxItemGroupId: item?.taxItemGroupId,
        taxItemGroupName: item?.taxItemGroupName,
        uomid: item?.uomid,
        uomname: item?.uomname,
        quantity: item?.quantity,
        basePrice: Math.abs(item?.invoicePrice),
        purchaseDateTime:  res?.data?.objHeaderDTO?.PurchaseDateTime || res?.data?.objHeaderDTO?.purchaseDateTime
      }));
      setter(newRowData);
      setDisabled && setDisabled(false);
  } catch (error) {
    setDisabled && setDisabled(false);
  }
};

// get by id
export const getItemTransferInById = async (
  itemTypeId,
  taxPurchaseOrSalesId,
  setter,
  setDisabled
) => {
  setDisabled && setDisabled(true);
  try {
    const res = await Axios.get(
      `/vat/ItemTransferIn/GetItemTransferInById?ItemTypeId=${itemTypeId}&Id=${taxPurchaseOrSalesId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;

      const headerData = data?.getByIdHeader;
      const modifiedData = {
        getByIdHeader: {
          ...headerData,
          otherBranchName: {
            value: headerData?.otherBranchId,
            label: headerData?.otherBranchName,
          },
          transferNo: {
            value: headerData?.taxPurchaseId,
            label: headerData?.taxPurchaseCode,
          },
          itemType: {},
          otherBranchAddress: headerData?.otherBranchAddress,
          isSemiFinisedItem:
            headerData?.isSemiFinisedItem || data?.isSemiFinisedItem,
        },
        getByIdPurchseRow: data?.getByIdPurchseRow,
        getByIdSalesRow: data?.getByIdSalesRow,
      };
      setter(modifiedData);
      setDisabled && setDisabled(false);
    }
  } catch (error) {
    setDisabled && setDisabled(false);
  }
};
