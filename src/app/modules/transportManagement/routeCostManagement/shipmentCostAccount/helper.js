import Axios from "axios";
import { toast } from "react-toastify";

export const GetShipmentCostEntryByCompany_api = async (
  accId,
  buId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/fino/ShipmentCostEntry/GetShipmentCostEntryByCompany?AccountId=${accId}&BusinessUnitId=${buId}&IsAccountsEntry=false&IsAuditApprove=true&PageSize=100&PageNo=1&ViewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.data?.length > 0) {
        setter(res?.data?.data?.map((itm) => ({ ...itm, itemCheck: false })));
      } else {
        toast.warning("Data not found");
        setter([]);
      }
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};
export const GetShipmentCostEntryByOther_api = async (
  accId,
  buId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/fino/ShipmentCostEntry/GetShipmentCostEntryByOther?AccountId=${accId}&BusinessUnitId=${buId}&IsAccountsEntry=false&IsAuditApprove=true&PageSize=100&PageNo=1&ViewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.data?.length > 0) {
        setter(res?.data?.data?.map((itm) => ({ ...itm, itemCheck: false })));
      } else {
        toast.warning("Data not found");
        setter([]);
      }

      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};


export const EditVCostAccountApprove_api = async (data, cb, setDisabled, values) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/tms/Shipment/EditVCostAccountApprove`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb(values?.reportType);
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};