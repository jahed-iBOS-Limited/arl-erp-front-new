import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "./../../../../../../_helper/_dateFormate";

export const getNationalityDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetNationalityDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getBloodGroupDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetBloodGroupDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getGenderDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetGenderDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getEmpIdentificationTypeDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetEmployeeIdentificationTypeDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};
export const getMeritalStatusDDL_api = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/MeritalStatusDDL");
    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};
export const religionDDL_api = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/ReligionDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

//CREATE CreateEmployeePersonalInformation
export const createEmployeePersonalInformation = async (
  payload,
  cb,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      "/hcm/EmployeePersonalInformation/CreateEmployeePersonalInformation",
      payload
    );
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "API not Work");
    setDisabled(false);
  }
};

//GetEmpPersonalInfoById
export const getEmpPersonalInfoById_api = async (id, setter) => {
  try {
    const res = await axios.get(
      `/hcm/EmployeePersonalInformation/GetEmpPersonalInfoById?PersonalInfoId=${id}`
    );

    if (res.status === 200 && res.data) {
      const data = res.data[0];

      const modifyGridData = {
        personalInfoId: data?.personalInfoId,
        employeeNickName: data?.employeeNickName,
        nationality: data?.natinalityId
          ? {
              value: data?.natinalityId,
              label: data?.natinalityName,
            }
          : "",
        dateOfBirth: _dateFormatter(data?.dateOfBirth),
        placeofBirth: data?.placeOfBirth,
        identificationType: data?.identificationTypeId
          ? {
              value: data?.identificationTypeId,
              label: data?.identificationType,
            }
          : "",
        identificationNo: data?.identificationNo,
        gender: data?.genderId
          ? { value: data?.genderId, label: data?.gender }
          : "",
        religion: data?.religionId
          ? { value: data?.religionId, label: data?.religion }
          : "",
        bloodGroup: data?.bloodGroupId
          ? {
              value: data?.bloodGroupId,
              label: data?.bloodGroupName,
            }
          : "",
        height: data?.heightCm,
        weight: data?.weightKg,
        emailPersonal: data?.personalEmail,
        employeeTINNo: data?.employeeTinno,
        personalContactNo: data?.personalContact,
        alternativeContactNo: data?.alternateContact,
        residenceContactNo: data?.residenceContact,
        maritalStatus: data?.maritalStatusId
          ? {
              value: data?.maritalStatusId,
              label: data?.maritalStatus,
            }
          : "",
        dateofMarriage: _dateFormatter(data?.dateOfMarriage),
        photograph: "",
        cv: "",
        identificationDoc: data?.identificationDocLink,
      };

      if (res.data.length > 0) {
        setter(modifyGridData);
      } else {
        setter("");
      }
    }
  } catch (error) {}
};

export const employeePersonalInformation_api = async (payload, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.put(
      "/hcm/EmployeePersonalInformation/EditEmployeePersonalInformation",
      payload
    );

    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Submitted unsuccessful");
    setDisabled(false);
  }
};
