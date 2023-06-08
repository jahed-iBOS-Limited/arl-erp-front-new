import axios from "axios";
import { toast } from "react-toastify";

export const getVatBranches_api = async (userId, accid, buid, setter) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${buid}&OrgUnitTypeId=15`
    );
    if (res?.data.length > 0) {
      const modify = res?.data;
      const all = {
        value: 0,
        label: "All",
      };
      modify.unshift(all);
      setter(modify);
    }
  } catch (error) {
    setter([]);
  }
};

export const SalesInformation_Report_api = async (
  accid,
  buid,
  fromDate,
  toDate,
  branchid,
  typeId,
  taxItemGroupId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true)
  try {
    const res = await axios.get(
      `/vat/SalesInformationReport/SalesInformation?accountId=${accid}&businessUnitId=${buid}&taxBranchId=${branchid}&fromDate=${fromDate}&toDate=${toDate}&ReportType=${typeId}&TaxItemGroupId=${taxItemGroupId}`
    );
    setLoading && setLoading(false)
    if (res?.data?.length > 0) {
      setter(res?.data);
    } else {
      toast.warning("Data Not Found", {id: 'data not found'});
      setter([]);
    }
  } catch (error) {
    setLoading && setLoading(false)
    console.log(error);
  }
};

//item type ddl
export const GetItemTypeDDL_api = async (setter) => {
  try {
    const res = await axios.get(`/vat/TaxDDL/GetTaxItemTypeDDL`);
    const filtering = res?.data?.filter((itm) => itm.value !== 1);
    setter(filtering);
  } catch (error) {}
};

//item ddl (cascading)
export const GetItemNameDDL_api = async (accId, buId, typeId, setter) => {
  try {
    const res = await axios.get(
      `/vat/TaxDDL/GetTaxItemListByItemTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}&TaxItemTypeId=${typeId}`
    );
    if (res?.data?.length > 0) {
      const modify = res?.data;
      const all = {
        value: 0,
        label: "All",
      };
      modify.unshift(all);
      setter(modify);
      console.log("modify", modify);
    }
  } catch (error) {}
};
