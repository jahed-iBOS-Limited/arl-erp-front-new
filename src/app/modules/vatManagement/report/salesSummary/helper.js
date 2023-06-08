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
  } catch (error) {}
};

export const SalesSummaryReport_api = async (
  accid,
  buid,
  fromDate,
  toDate,
  branchid,
  summarizationId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/vat/SummaryReport/SalesSummaryReport?accountId=${accid}&businessunitId=${buid}&fromDate=${fromDate}&toDate=${toDate}&branchId=${branchid}&SummarizationId=${summarizationId}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length > 0) {
        const modifiedData = res?.data?.map((itm) => ({
          ...itm,
          quantity: itm?.quantity?.toFixed(2),
          amount: itm?.amount?.toFixed(2),
          sdTotal: itm?.sdTotal?.toFixed(2),
          vatTotal: itm?.vatTotal?.toFixed(2),
          grandTotal: itm?.grandTotal?.toFixed(2),
        }));
        setter(modifiedData);
      } else {
        toast.warning("Data Not Found");
        setter([]);
      }
    }
    setLoading(false);
  } catch (error) {
    toast.warning(error?.response?.data?.message);
    setter([]);
    setLoading(false);
  }
};
