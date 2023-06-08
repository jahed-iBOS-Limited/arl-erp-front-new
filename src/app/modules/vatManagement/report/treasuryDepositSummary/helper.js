import axios from "axios";
import { toast } from "react-toastify";

export const getVatBranches_api = async (userId, accid, buid, setter) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${buid}&OrgUnitTypeId=15`
    );
    if (res.status === 200 && res?.data) {
      const modifiedData = [{ value: 0, label: "All" }, ...res?.data];
      setter(modifiedData);
    }
  } catch (error) {
    
  }
};

export const TreasuryDepositReport_api = async (
  accid,
  buid,
  fromDate,
  toDate,
  branchid,
  setter
) => {
  try {
    const res = await axios.get(
      `/vat/SummaryReport/TreasuryDepositReport?accountId=${accid}&businessunitId=${buid}&fromDate=${fromDate}&toDate=${toDate}&branchId=${branchid}`
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
