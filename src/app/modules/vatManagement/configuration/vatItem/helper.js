import Axios from "axios";
import { toast } from "react-toastify";

export const GetVatItemPagination = async (
  accountId,
  buId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search,
  itemtypeId
) => {
  setLoading(true);
  const searchPath = search ? `searchTerm=${search}&` : "";
  const itemtypeIdCon = itemtypeId ? itemtypeId : 0;
  try {
    const res = await Axios.get(
      `/vat/TaxItemGroup/GetTaxItemGroupSearchPagination?${searchPath}accountId=${accountId}&businessUnitId=${buId}&itemtypeId=${itemtypeIdCon}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );

    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const GetVatItemView = async (taxItemGroupId, setter, setDisabled) => {
  try {
    setDisabled && setDisabled(true);
    const res = await Axios.get(
      `/vat/TaxItemGroup/GetTaxItemGroupById?taxItemGroupId=${taxItemGroupId}
      `
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data[0];
      const newData = {
        ...data,
        taxItemTypeId: {
          value: data?.taxItemTypeId,
          label: data?.taxItemTypeName,
        },
        taxItemCategoryId: {
          value: data?.taxItemCategoryId,
          label: data?.taxItemCategoryName,
        },
        supplyTypeId: {
          value: data?.supplyTypeId,
          label: data?.supplyTypeName,
        },
        hsCode: {
          value: data?.hsCode,
          label: data?.hsCode,
        },
        uomName: {
          value: data?.uomId,
          label: data?.uomName,
        },
        businessUnitId: {
          value: data?.businessUnitId,
          label: data?.businessUnitName,
        },
        itemTypeId: data?.itemTypeId
          ? {
              value: data?.itemTypeId,
              label: data?.itemTypeName,
            }
          : "",
      };
      setter(newData);
      setDisabled && setDisabled(false);
    }
  } catch (error) {
    setDisabled && setDisabled(false);
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

export const saveVatItem = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(`/vat/TaxItemGroup/CreateTaxItemGroup`, data);
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

export const saveEditedVatItem = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/vat/TaxItemGroup/EditTaxItemGroup`, data);
    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getItemCategoryDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/item/ItemCategoryGL/ItemCategoryDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getItemCategoryDDLByTypeId_api = async (
  accId,
  buId,
  itemTypeId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/item/ItemCategory/GetItemCategoryDDLByTypeId?AccountId=${accId}&BusinessUnitId=${buId}&ItemTypeId=${itemTypeId}`
    );
    if (res.status === 200 && res?.data) {
      const modifiedData = res?.data?.map((item) => ({
        value: item.itemCategoryId,
        label: item.itemCategoryName,
      }));
      setter(modifiedData);
    }
  } catch (error) {
    setter([]);
  }
};

export const getSupplyTypeDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/SupplyTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getHSCodeDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/HSCodeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getTaxItemTypeDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTaxItemTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getItemUOMDDL_api = async (accountId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/item/ItemUOM/GetItemUOMDDL?AccountId=${accountId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetHSCodeByTarrifSchedule_api = async (hsCode, type, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxItemGroup/GetHSCodeByTarrifSchedule?Code=${hsCode}&Type=${type}
      `
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};
