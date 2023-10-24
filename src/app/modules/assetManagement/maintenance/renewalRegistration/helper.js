import Axios from "axios";
import { toast } from "react-toastify";

export const getAssetPlantDDL = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getVehicleNumberDDL = async (accId, buid, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetVehicleNoDDL?PlantId=${plantId}&AccountId=${accId}&UnitId=${buid}`
    );
    let newData = res?.data.map((data) => {
      return {
        ...data,
        label: data?.name,
      };
    });
    setter(newData);
  } catch (error) {}
};

export const getRenewalTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(`/asset/DropDown/GetRenewalService`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getActivityByRenewalServiceId = async (
  serviceId,
  brtaId,
  assetId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/asset/DetalisView/GeAttributeByRenewalServiceId?ServiceId=${serviceId}&BrtaVehicelTypeId=${brtaId ||
        0}&assetId=${assetId}`
    );
    if (res.status === 200 && res?.data) {
      const newData = res?.data?.map((item) => ({
        ...item,
        amount: item?.amount,
      }));

      setter(newData);
    }
  } catch (error) {}
};

export const getGridData = async ({
  accId,
  buId,
  values,
  setter,
  setLoading,
  pageNo,
  pageSize,
}) => {
  const FromDate =
    values?.status?.value === 0
      ? values?.fromDate
        ? `&dteFrom=${values?.fromDate}`
        : ""
      : "";
  const ToDate =
    values?.status?.value === 0
      ? values?.toDate
        ? `&dteTo=${values?.toDate}`
        : ""
      : "";
  setLoading(true);
  try {
    const res = await Axios.get(
      `/asset/LandingView/GetRenewalRegistrationList?typeId=${
        values?.status?.value === 0 ? 1 : 4
      }&AccountId=${accId}&UnitId=${buId}&PlantId=${0}&RenewalServiceId=${values
        ?.renewalType?.value ||
        0}&AssetId=${values?.vehicleNo?.value || 0}${FromDate}${ToDate}&statusId=${values?.status?.value ||
        0}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const saveRenewalReg = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(`/asset/Renewal/CreateRenewal`, data);
    if (res.status === 200) {
      cb();
      toast.success(res?.data?.message || "Submitted successfully");
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const cancelRenewalRegById = async (id, cb, user) => {
  try {
    const res = await Axios.delete(
      `/asset/Renewal/CancelRenewal?Id=${id}&ActionBy=${user}`
    );
    if (res.status === 200) {
      cb && cb();
      toast.success(res?.data?.message || "Successfully Deleted");
    }
  } catch (error) {}
};

export const getSingleDataById = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DetalisView/GetRenewalInfo?RenewalId=${id}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data[0]);
    }
  } catch (error) {}
};

export const getBRTAVehicleType = async (setter) => {
  try {
    const res = await Axios.get(`/asset/DropDown/GetBRTAVehicleType`);
    setter(res?.data);
  } catch (error) {}
};
