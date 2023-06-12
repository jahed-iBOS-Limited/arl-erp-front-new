import axios from "axios";
import { toast } from "react-toastify";
export const GetItemTypeDDLPurchase_api = async (setter) => {
  setter([])
  try {
    const res = await axios.get(`/vat/TaxDDL/GetTaxItemTypeDDL`);
    if (res.status === 200 && res?.data) {
      const filtering = res?.data?.filter((itm) => itm.value !== 3);
      setter(filtering);
    }
  } catch (error) {}
};

export const GetItemTypeDDLSales_api = async (setter) => {
  setter([])
  try {
    const res = await axios.get(`/vat/TaxDDL/GetTaxItemTypeDDL`);
    if (res.status === 200 && res?.data) {
      const filtering = res?.data?.filter((itm) => itm.value !== 1);
      setter(filtering);
    }
  } catch (error) {}
};
export const GetItemNameDDL_api = async (accId, buId, typeId, setter) => {
  setter([])
  try {
    const res = await axios.get(
      `/vat/TaxDDL/GetTaxItemListByItemTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}&TaxItemTypeId=${typeId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getVatBranches_api = async (userId, accid, buid, setter) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${buid}&OrgUnitTypeId=15`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const PurchaseRegister_Report_api = async (
  accid,
  buid,
  fromDate,
  toDate,
  itemId,
  branch,
  setter,
  setLoading
) => {
  setter([])
  try {
    setLoading && setLoading(true);
    const res = await axios.get(
      `/vat/VATSP/PurchaseRegister?intAccountId=${accid}&intBusinessUnitId=${buid}&FromDate=${fromDate}&ToDate=${toDate}&ItemId=${itemId}&intBranch=${branch}`
    );
    if (res.status === 200 && res?.data) {
      setLoading && setLoading(false);
      if (res?.data?.length > 0) {
        setter(res?.data);
      } else {
        toast.warning("Data Not Found");
        setter([]);
      }
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getHeaderData_api = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/vat/Mushak91/GetTaxPayerInformation?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter({});
  }
};


export const SalesRegister_Report_api = async (
  accid,
  buid,
  fromDate,
  toDate,
  itemId,
  branch,
  setter,
  setLoading
) => {
  setter([])
  setLoading && setLoading(true)
  try {
    const res = await axios.get(
      `/vat/VATSP/SalesRegister?intAccountId=${accid}&intBusinessUnitId=${buid}&FromDate=${fromDate}&ToDate=${toDate}&ItemId=${itemId}&intBranch=${branch}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
    setLoading && setLoading(false)
  } catch (error) {
    setLoading && setLoading(false)
  }
};
