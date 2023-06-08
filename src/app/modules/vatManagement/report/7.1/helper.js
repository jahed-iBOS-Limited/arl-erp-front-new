import Axios from "axios";
import { toast } from "react-toastify";

export const getVatBranches_api = async (userId, accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${buid}&OrgUnitTypeId=15`
    )
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}

export const getGridData = async (values, setter, cb) => {
  try {
    const res = await Axios.get(
      `/vat/DebitCreditReport/GetPurchaseReportByBranchId?branchId=${values?.branch?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length === 0) {
        toast.warning("No Data Found", { toastId: "NDF" });
      }
      setter(res?.data);
      cb();
    }
  } catch (error) {}
};

export const getGridDataTwo = async (values, setter, cb) => {
  try {
    const res = await Axios.get(
      `/vat/DebitCreditReport/GetSalesReportByBranchId?branchId=${values?.branch?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length === 0) {
        toast.warning("No Data Found", { toastId: "NDF" });
      }
      setter(res?.data);
      cb();
    }
  } catch (error) {}
};
