import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from './../../../../_helper/_dateFormate';

export const GetItemDestroyPagination = async (
  accountId,
  buId,
  taxBranchId,
  itemTypeId,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `vat/ItemDestroy/GetItemDestroyPagination?accountId=${accountId}&businessUnitId=${buId}&taxBranchId=${taxBranchId}&itemTypeId=${itemTypeId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    
    setLoading(false);
  }
};

export const GetItemDestroyView = async (
  itemDestroyId,
  itemTypeId,
  setter,
  setRowDto
) => {
  try {
    const res = await Axios.get(
      `/vat/ItemDestroy/GetItemDestroyById?itemDestroyId=${itemDestroyId}&itemTypeId=${itemTypeId}
      `
    );
    let {
      branchName,
      branchAddress,
      transactionDate,
      vatTotal,
      referenceNo,
      referenceDate,
      sdChargeableTotal,
      sdTotal,
      itemName,
      itemType,
      quantity,
    } = res?.data.objHeder;

    const obj = {
      branchName,
      branchAddress,
      transactionDate: _dateFormatter(transactionDate),
      vatTotal: vatTotal,
      referenceNo: referenceNo,
      referenceDate: _dateFormatter(referenceDate),
      sdChargeableValue: sdChargeableTotal,
      sdTotal: sdTotal,
      itemName,
      itemType,
      quantity,
    };
    setter(obj);
    const itemTypeIdCondition =
      +itemTypeId === 3 ? res.data.objSalesList : res.data.objProdList;

    const row = itemTypeIdCondition?.map((item) => ({
      materialName: item.taxItemGroupName,
      uom: item.uomname,
      useQuantity: item.quantity,
      sdChargeableValue: item?.sdChargableValue,
      sdTotal: item.sdtotal,
      vat: item.vatTotal,
      basedPrice: item.itemBaseValue,
    }));

    setRowDto(row);
  } catch (error) {
    
  }
};

export const saveItemDestroy = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(`/vat/ItemDestroy/CreateItemDestroy`, data);
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const saveEditedProduction = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/vat/TaxItemGroup/EditTaxItemGroup`, data);
    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getTaxBranchDDL_api = async (userId, accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/vat/OrganizationalUnitUserPermissionFotVat/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${buid}&OrgUnitTypeId=15`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getItemTypeDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTaxItemTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getItemNamelistDDL_api = async (
  accId,
  buId,
  taxItemTypeId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetTaxItemListByItemTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}&TaxItemTypeId=${taxItemTypeId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getFourData_api = async (
  accId,
  buId,
  taxItemNameId,
  ItemQty,
  setRowDto,
  values
) => {
  try {
    const res = await Axios.get(
      `/vat/VatMgtCommonProcess/GetDestroyItemInfoOnQty?AccountId=${accId}&BusinessUnitId=${buId}&ItemGroupId=${taxItemNameId}&ItemQty=${ItemQty}`
    );
    if (res.status === 200 && res?.data.length > 0) {
      const rowDtoModified = res?.data?.map((itm) => ({
        materialName: itm?.materialName,
        uom: itm?.uomName,
        useQuantity: itm?.usedQty,
        sdChargeableValue: 0,
        sdTotal: 0,
        vat: 0,
        basedPrice: itm?.basedPrice,
        taxItemGroupId: values?.itemName?.value,
        taxItemGroupName: values?.itemName?.label,
        uomId: itm?.uomId,
      }));

      setRowDto([...rowDtoModified]);
      // console.log(res?.data, "data");
    } else {
      toast.warning("No data found");
    }
  } catch (error) {
    
  }
};