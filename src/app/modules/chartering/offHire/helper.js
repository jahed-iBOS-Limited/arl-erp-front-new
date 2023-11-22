import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { iMarineBaseURL } from "../helper";

// Validation schema
export const validationSchema = Yup.object().shape({
  vesselName: Yup.object().shape({
    label: Yup.string().required("Vessel name is required"),
    value: Yup.string().required("Vessel name is required"),
  }),
  voyageNo: Yup.object().shape({
    label: Yup.string().required("Voyage No is required"),
    value: Yup.string().required("Voyage No is required"),
  }),
  offHireReason: Yup.string().required(" Off Hire Reason is required"),
  durationPercentage: Yup.string().required("Duration Percentage is required"),
});

export const getOffHireLandingData = async (
  accId,
  buId,
  vesselId,
  voyageId,
  pageNo,
  pageSize,
  searchValue,
  setter,
  setLoading
) => {
  setLoading(true);
  const search = searchValue ? `&search=${searchValue}` : "";
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/OffHire/GetOffHireLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&VoyageNoId=${voyageId}&VesselId=${vesselId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${search}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

export const createOffHire = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${iMarineBaseURL}/domain/OffHire/CreateOffHire`,
      data
    );
    cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};

export const editOffHire = async (data, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${iMarineBaseURL}/domain/OffHire/EditOffHire`,
      data
    );
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};

export const getOffHireById = async (id, setter, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/OffHire/GetOffHireViewDetailsById?offHireId=${id}`
    );
    cb(res?.data);
    const {
      voyageId,
      voyageNumber,
      vesselId,
      vesselName,
      offHireFinalDuration,
      addressCommision,
      brokarageCommision,
    } = res?.data;
    const modifyData = {
      ...res?.data,
      voyageNo: { value: voyageId, label: voyageNumber },
      vesselName: { value: vesselId, label: vesselName },
      finalOffHireDuration: offHireFinalDuration,
      offHireAddressCommission: addressCommision,
      offHireBrokerCommission: brokarageCommision,
    };
    setter(modifyData);
    setLoading(false);
  } catch (err) {
    setter({});
    setLoading(false);
  }
};

export const getDailyHireByVoyageNo = async (id, setter) => {
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/HireOwner/GetDailyHireCVE30DaysDDL?voaygeNoId=${id}`
    );
    setter(res?.data[0]);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setter({});
  }
};
