import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { iMarineBaseURL } from "../../helper";

export const validationSchema = Yup.object().shape({
  // motherVessel: Yup.string().required("Mother Vessel is required"),
  ref: Yup.string().required("Ref is required"),
  // unit: Yup.object()
  //   .shape({
  //     label: Yup.string().required("Unit is required"),
  //     value: Yup.string().required("Unit is required"),
  //   })
  //   .typeError("Unit is required"),
});

export const getSurveyVesselData = async (
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
      `${iMarineBaseURL}/domain/LighterVesselSurvey/GetCargoLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

// use
export const createSurveyVessel = async (data, cb) => {
  try {
    const res = await axios.post(
      `${iMarineBaseURL}/domain/LighterVesselSurvey/CreateLighterVesselSurvey`,
      data
    );
    toast.success(res?.data?.message || "Created Successfully");
    cb();
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};

// use
// Business Unit DDL
export function getBUDDL(userId, clientId) {
  return axios.get(
    `/domain/OrganizationalUnitUserPermission/GetBusinessUnitPermissionbyUser?UserId=${userId}&ClientId=${clientId}`
  );
}

export function getCargoDDL() {
  return axios.get(`${iMarineBaseURL}/domain/HireOwner/GetCargoDDL`);
}

export const editSurveyVessel = async (data, cb) => {
  try {
    const res = await axios.put(
      `${iMarineBaseURL}/domain/LighterVesselSurvey/EditLighterVesselSurvey`,
      data
    );
    toast.success(res?.data?.message || "Created Successfully");
    cb();
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};
