import axios from "axios";
import { toast } from "react-toastify";

export const loadUserList = (v, accId, buId) => {
  if (v?.length < 3) return [];
  return axios
    .get(
      `/domain/CreateUser/GetUserListSearchDDL?AccountId=${accId}&BusinessUnitId=${buId}&searchTerm=${v}`
    )
    .then((res) => {
      const updateList = res?.data.map((item) => ({
        ...item,
        label: item?.label + ` [${item?.value}]`,
      }));
      return updateList;
    });
};

export const saveShipPointOperator = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/oms/ShipPoint/CreateShipPointPermission`,
      payload
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const permissionCancel = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(`/oms/ShipPoint/ShipPointPermissionCancel`, payload);
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
