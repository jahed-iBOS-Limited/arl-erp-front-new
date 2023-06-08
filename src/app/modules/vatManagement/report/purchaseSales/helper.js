import axios from "axios";
import { toast } from "react-toastify";
export const GetItemTypeDDL_api = async (setter) => {
  try {
    const res = await axios.get(`/vat/TaxDDL/GetTaxItemTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const GetItemNameDDL_api = async (accId, buId, typeId, setter) => {
  try {
    const res = await axios.get(
      `/vat/TaxDDL/GetTaxItemListByItemTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}&TaxItemTypeId=${typeId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getVatBranches_api = async (userId, accid, buid, setter) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${buid}&OrgUnitTypeId=15`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const PurchaseRegister_Report_api = async (
  accid,
  buid,
  fromDate,
  toDate,
  itemId,
  branch,
  setter
) => {
  try {
    const res = await axios.get(
      `/vat/VATSP/PurchaseSalesRegister?intAccountId=${accid}&intBusinessUnitId=${buid}&FromDate=${fromDate}&ToDate=${toDate}&ItemId=${itemId}&intBranch=${branch}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length > 0) {
        setter(res?.data);
      } else {
        toast.warning("Data Not Found");
        setter([]);
      }
    }
  } catch (error) {
    
  }
};
