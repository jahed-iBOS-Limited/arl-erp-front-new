import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { iMarineBaseURL } from "../../helper";

export const validationSchema = Yup.object().shape({
  lighterVesselName: Yup.string().required("Name is required"),
  vesselType: Yup.string().required("Vessel Type is required"),
  capacity: Yup.string().required("Capacity is required"),
});

export const getLighterVesselList = async (
  accId,
  buId,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/LighterVessel/GetLighterVesselLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const saveLighterVessel = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${iMarineBaseURL}/domain/LighterVessel/CreateLighterVessel`,
      data
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const saveEditedLighterVessel = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${iMarineBaseURL}/domain/LighterVessel/EditLighterVessel`,
      data
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "An error occurred while updating!"
    );
    setLoading(false);
  }
};

export const getRevenueCenterList = async (buId, setter) => {
  try {
    const res = await axios.get(
      `/fino/AccountingConfig/GetRevenueCenterList?businessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getCostCenterList = async (accId, buId, sbuId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/CostCenter/GetCostCenterDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getSBUList = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
