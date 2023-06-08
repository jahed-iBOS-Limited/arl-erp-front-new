import Axios from "axios";
import { toast } from "react-toastify";

export const getCheckPostListDDL = async (userId, accId, unitId, setter) => {
  try {
    // const res = await Axios.get(
    //   `/domain/OrganizationalUnitUserPermission/GetCheckpostListPermissionByUser?UserId=${userId}&ClientId=${clientId}&UnitId=${unitId}`
    // );
    const res = await Axios.get(
      `/domain/OrganizationalUnitUserPermission/GetCheckpostListPermissionByUser?UserId=${userId}&AccountId=${accId}&BusinessUnitId=${unitId}`
    );

    if (res.status === 200 && res?.data) {
      const data = res?.data;
      console.log("got data", data);
      // const newData = data.map((itm) => {
      //   return {
      //     value: itm?.organizationUnitReffId,
      //     label: itm?.organizationUnitReffName,
      //   }
      // })
      // setter(newData)
      setter(data);
    }
  } catch (error) {}
};

export const getVehicleNoDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/Vehicle/GetVehicleDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      setter(data);
    }
  } catch (error) {}
};

export const getVehicleInfobyId = async (
  accId,
  buId,
  vehicleId,
  setFieldValue
) => {
  try {
    const res = await Axios.get(
      `/tms/Vehicle/GetVehicleInfobyId?AccountId=${accId}&BusinessUnitId=${buId}&VehicleId=${vehicleId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      setFieldValue("driverName", data?.driverName);
      setFieldValue("driverContact", data?.driverContact);
      // setter(data);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getVehiclePurposeTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(`/tms/Vehicle/GetVehiclePurposeTypeDDL`);
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      setter(data);
    }
  } catch (error) {}
};

export const getPlantDDL = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      setter(data);
    }
  } catch (error) {}
};

export const getShipPointDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      setter(data);
    }
  } catch (error) {}
};

export const getCameFromDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/Plant/GetPlantAddressDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      setter(data);
    }
  } catch (error) {}
};

export const saveCheckpostVehicleInOut = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/tms/CheckpostVehicleInOut/CreateCheckpostVehicleInOut`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

// Update Checkpost Vehicle In Out data
export const updateCheckpostVehicleInOut = async (
  payload,
  updateRowDto,
  setRowDto,
  setDisabled
) => {
  try {
    setDisabled(true);
    const res = await Axios.put(
      `/tms/CheckpostVehicleInOut/UpdateCheckpostVehicleInOut`,
      payload?.data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Checkout Close successfully");
      setRowDto(updateRowDto);
      payload.cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

// Update Checkpost Vehicle In Out data
export const checkoutAction = async (id, updateRowDto, setRowDto) => {
  try {
    const res = await Axios.put(
      `/tms/CheckpostVehicleInOut/CheckOut?InOutId=${id}`
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Checkout successfully");
      setRowDto(updateRowDto);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getcheckPostItemView = async (checkpostInoutId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/CheckpostVehicleInOut/GetCheckpostVehicleInOutById?CheckpostInOutEntryId=${checkpostInoutId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;

      const newData = {
        ...data,
      };
      setter(newData);
    }
  } catch (error) {}
};
