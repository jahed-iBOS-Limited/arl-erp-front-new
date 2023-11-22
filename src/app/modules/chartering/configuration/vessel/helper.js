import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { iMarineBaseURL } from "../../helper";

// Validation schema
export const validationSchema = Yup.object().shape({
  vesselName: Yup.string().required("Vessel name is required"),
  ownerName: Yup.object().shape({
    label: Yup.string().required("Owner name is required"),
    value: Yup.string().required("Owner name is required"),
  }),
  flag: Yup.object().shape({
    label: Yup.string().required("Flag is required"),
    value: Yup.string().required("Flag is required"),
  }),
  deadWeight: Yup.string().required("Dead Weight is required"),
  imono: Yup.string().required("IMO No is required"),
  grt: Yup.string().required("GRT is required"),
  nrt: Yup.string().required("NRT is required"),
});

export const CreateVessel = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${iMarineBaseURL}/domain/Vessel/CreateVessel`,
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

export const GetOwnerDDL = async (setter) => {
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/Vessel/GetOwnerInfoDDL`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const GetVesselLandingData = async (
  accId,
  buId,
  pageNo,
  pageSize,
  searchValue,
  status,
  filterBy,
  setLoading,
  setter
) => {
  setLoading(true);
  const search = searchValue ? `&search=${searchValue}` : "";
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/Vessel/GetVesseLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${search}&ActiveOrInActiveg=${status}&status=${filterBy}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
    setter([]);
  }
};

export const activeInactiveVessel = async (id, status, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${iMarineBaseURL}/domain/Vessel/ActiveOrInActive?vesselId=${id}&activeOrInActive=${status}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const GetVesselById = async (id, setLoading, setter) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/Vessel/GetVesselViewDetailsById?vesselId=${id}`
    );
    const modifyData = {
      ...res?.data,
      ownerName: {
        value: res?.data?.ownerId,
        label: res?.data?.ownerName,
      },
      flag: {
        value: res?.data?.flagId,
        label: res?.data?.flag,
      },
      sbu: {
        value: res?.data?.sbuId,
        label: res?.data?.sbuName,
      },
      revenueCenter: {
        value: res?.data?.revenueCenterId,
        label: res?.data?.revenueCenterName,
      },
      costCenter: {
        value: res?.data?.costCenterId,
        label: res?.data?.costCenterName,
      },
      profitCenter: {
        value: res?.data?.profitCenterId,
        label: res?.data?.profitCenterName,
      },
    };
    setter(modifyData);
    setLoading(false);
  } catch (error) {
    setter({});
    setLoading(false);
  }
};

export const UpdateVessel = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${iMarineBaseURL}/domain/Vessel/EditVessel`,
      payload
    );
    toast.success(res?.data?.message);

    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const DeleteVessel = async (vesselId, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${iMarineBaseURL}/domain/Vessel/DeleteVessel?vesselId=${vesselId}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
