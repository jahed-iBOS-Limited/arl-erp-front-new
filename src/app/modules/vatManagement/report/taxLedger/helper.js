import axios from "axios";
import { toast } from "react-toastify";

export const getTaxLedgerReport_api = async (
  accid,
  buid,
  branchId,
  date,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/TaxLedgerReport/TaxLedgerReport?accountId=${accid}&businessUnitId=${buid}&date=${date}&branchId=${branchId}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data[0]?.objRow.length > 0) {
        setter(res?.data[0]);
        setLoading(false);
      } else {
        toast.warning("Data Not Found");
        setLoading(false);
        setter([]);
      }
    }
  } catch (error) {}
};

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
