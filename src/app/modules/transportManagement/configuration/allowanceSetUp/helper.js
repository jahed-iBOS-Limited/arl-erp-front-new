import Axios from "axios";
import { toast } from "react-toastify";

export const GetVahicleDDL = async (setter) => {
  try {
    const res = await Axios.get(`/tms/TransportMgtDDL/GetVehicleCapacityDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetComponentDDL = async (accId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/TransportMgtDDL/GetComponentDDL?AccountId=${accId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const saveAllowanceSetUp = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    // setDisabled(true);
    const res = await Axios.post(
      `/tms/AllowenceSetup/CreateAllowenceSetup`,
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

export const saveMillageSetUp = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/tms/BusinessUnitMillageAllowance/CreateBusinessUnitMillageAllowance`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const GetAllowanceSetUpPagination = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/AllowenceSetup/AllowanceSetupLanding?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetMillagePagination = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/BusinessUnitMillageAllowance/GetBusinessUnitMillageAllowanceByUnitId?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSingleData = async (capacityId, buId, setter, setRowDto) => {
  try {
    const res = await Axios.get(
      `/tms/AllowenceSetup/GetAllowenceSetupById?CapacityId=${capacityId}&businessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;

      const newRowDto = data?.map((item) => ({
        vahicleCapacity: {
          value: item?.vehicleCapacityId,
          label: item?.vehicleCapacityName,
        },
        daComponent: {
          value: item?.dacostComponentId,
          label: item?.dacostComponentName,
        },
        daAmount: item?.daamount,
        amount: item?.downTripAllowance,
        allowance: {
          value: item?.downTripAllowanceId,
          label: item?.downTripAllowanceName,
        },
      }));
      setRowDto(newRowDto);
      setter(newRowDto);
    }
  } catch (error) {}
};

// Helper End
