import axios from "axios";
import { toast } from "react-toastify";

export const getTargetEntryData = async (
  buId,
  levelId,
  channelId,
  setter,
  setLoading,
  areaId
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/Complains/OperationalSetupNEmployee?BusinessUnitId=${buId}&LevelId=${levelId}&ChannelId=${channelId}&areaId=${areaId}`
    );
    setter(
      res?.data?.map((item) => ({ ...item, targetQty: "", isSelected: false }))
    );
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getManpowerSalesTargetLandingData = async (
  accId,
  buId,
  monthId,
  yearId,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/Complains/GetManPowerSalesTarget?AccountId=${accId}&BusinessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&Month=${monthId}&Year=${yearId}`
    );
    const modifyData = {
      ...res?.data,
      data: res?.data?.data?.map((item) => ({
        ...item,
        isEdit: false,
        tempTargetQuantity: item.targeQnt,
      })),
    };
    setter(modifyData);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const deletedTarget = async (id, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/oms/Complains/DeleteManPowerSalesTarget?id=${id}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const editSalesTarget = async (payload, cb, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/oms/Complains/EditManPowerSalesTarget`,
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
