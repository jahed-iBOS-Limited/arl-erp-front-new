import axios from "axios";
export const GetItemTypeDDL_api = async (setter) => {
  try {
    const res = await axios.get(`/vat/TaxDDL/GetTaxItemTypeDDL`);
    if (res.status === 200 && res?.data) {
      const filtering = res?.data?.filter((itm) => itm.value !== 1);
      setter(filtering);
    }
  } catch (error) {}
};

export const GetItemNameDDL_api = async (accId, buId, typeId, setter) => {
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
    if (res?.data?.length > 0) {
      const modify = res?.data;
      const all = { value: 0, label: "All" };
      modify.unshift(all);
      setter(modify);
    }
  } catch (error) {
    setter([]);
  }
};

export const SalesRegister_Report_api = async (
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
      `/vat/VATSP/SalesRegister?intAccountId=${accid}&intBusinessUnitId=${buid}&FromDate=${fromDate}&ToDate=${toDate}&ItemId=${itemId}&intBranch=${branch}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
