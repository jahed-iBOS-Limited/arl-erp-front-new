import Axios from "axios";
import { toast } from "react-toastify";

export const getExternalData = async (
  accId,
  buId,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/fino/ShipmentCostEntry/GetShipmentCostEntryByOther?AccountId=${accId}&BusinessUnitId=${buId}&IsAccountsEntry=false&IsAuditApprove=false&PageSize=${pageSize}&PageNo=${pageNo}&ViewOrder=asc`
    );
    if (res.status === 200 && res?.data) {
      const obj = {
        ...res?.data,
        data: res?.data?.data?.map((item) => ({ ...item, itemCheck: false })),
      };
      setter(obj);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getInternalData = async (
  accId,
  buId,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/fino/ShipmentCostEntry/GetShipmentCostEntryByCompany?AccountId=${accId}&BusinessUnitId=${buId}&IsAccountsEntry=false&IsAuditApprove=false&PageSize=${pageSize}&PageNo=${pageNo}&ViewOrder=asc`
    );
    if (res.status === 200 && res?.data) {
      const obj = {
        ...res?.data,
        data: res?.data?.data?.map((item) => ({ ...item, itemCheck: false })),
      };
      setter(obj);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const approveItems = async (payload,cb, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.put(`/tms/Shipment/EditVCostAuditApprove`, payload);

    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      setLoading(false);
      cb()
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Submitted unsuccessful");
    setLoading(false);
  }
};
