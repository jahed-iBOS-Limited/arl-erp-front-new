// For Communication with external API's , for example ... get data, post data etc
import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "./../../../_helper/_dateFormate";

/* ================= Fetch All DDL ================= */
export const getDesignationDDL = async (setter) => {
  try {
    let res = await axios.get(`/hcm/HCMDDL/GetFunctionalDesignationDDL`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getSbuDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/hcm/HCMDDL/GetSBUDDL?AccountId=${accId}&BusineessUnitId=${buId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getDepartmentDDL = async (setter) => {
  try {
    let res = await axios.get(`/hcm/HCMDDL/GetDepartmentDDL`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getWorkplaceGroupDDL = async (setter) => {
  try {
    let res = await axios.get(`/hcm/HCMDDL/GetWorkplaceGroupDDL`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getHrPostionDDL = async (setter) => {
  try {
    let res = await axios.get(`/hcm/HCMDDL/GetHRPositionDDL`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getEmpGradeDDL = async (setter) => {
  try {
    let res = await axios.get(`/hcm/HCMDDL/GetEmployeeGradeDDL`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getEmpTypeDDL = async (setter) => {
  try {
    let res = await axios.get(`/hcm/HCMDDL/GetEmploymentTypeDDL`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getLineManagerDDL = async (setter) => {
  try {
    let res = await axios.get(`/hcm/HCMDDL/GetLineManagerDDL`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getBloodGroupDDL = async (setter) => {
  try {
    let res = await axios.get(`/hcm/HCMDDL/GetBloodGroupDDL`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getNationalityDDL = async (setter) => {
  try {
    let res = await axios.get(`/hcm/HCMDDL/GetNationalityDDL`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};
/* ================= Fetch All DDL End ================= */

export const getLandingData = async (
  accId,
  buId,
  setDisabled,
  setter,
  pageNo,
  pageSize
) => {
  setDisabled(true);
  try {
    let res = await axios.get(
      `/rtm/SalesForceInformation/SalesForceInfoLandingPasignation?AccountId=${accId}&BusinessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&vieworder=desc`
    );
    if (res?.status === 200) {
      setter(res?.data);
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};

export const createSalesForceInfo = async (payload, setDisabled, cb) => {
  setDisabled(true);
  try {
    let res = await axios.post(
      `/rtm/SalesForceInformation/CreateSalesForceInfo`,
      payload
    );
    if (res?.status === 200) {
      cb();
      toast.success(res?.data?.message, { toastId: "createBeat" });
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "createBeatError",
    });
    setDisabled(false);
  }
};

export const editSalesForceInfo = async (payload, setDisabled) => {
  setDisabled(true);
  try {
    let res = await axios.put(
      `/rtm/SalesForceInformation/EDitSalesForceInfo`,
      payload
    );
    if (res?.status === 200) {
      toast.success(res?.data?.message, { toastId: "editSalesForceInfo" });
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "editSalesForceInfoErr",
    });
    setDisabled(false);
  }
};

export const getSalesForceInfoById = async (empId, setDisabled, setter) => {
  setDisabled(true);
  try {
    let res = await axios.get(
      `/rtm/SalesForceInformation/GetSalesForceInfoById?EmployeeId=${empId}`
    );
    if (res?.status === 200) {
      setDisabled(false);
      const data = res?.data[0];
      const payload = {
        // DDL
        designation: {
          value: data?.designationId,
          label: data?.designationName,
        },
        sbu: {
          value: data?.sbuid,
          label: data?.sbuName,
        },
        department: {
          value: data?.departmentId,
          label: data?.departmentName,
        },
        workplaceGroup: {
          value: data?.workplaceGroupId,
          label: data?.workplaceGroupName,
        },
        hrPostion: {
          value: data?.positionId,
          label: data?.positionName,
        },
        empGrade: {
          value: data?.empGradeId,
          label: data?.empGradeName,
        },
        empType: {
          value: data?.employmentTypeId,
          label: data?.employmentTypeName,
        },
        lineManager: {
          value: data?.lineManagerId,
          label: data?.lineManagerName,
        },
        empLavel: {
          value: data?.employeeLevel,
          label: data?.employeeLevel,
        },
        bloodGroup: {
          value: data?.bloodGroupId,
          label: data?.bloodGroupName,
        },
        nationality: {
          value: data?.depertmentId,
          label: data?.departmentName,
        },

        // Basic Info
        employeeFirstName: data?.employeeFirstName,
        middleName: data?.middleName,
        lastName: data?.lastName,
        joiningDate: _dateFormatter(data?.joiningDate),
        presentAddress: data?.presentAddress,
        permanentAddress: data?.permanentAddress,
        dateOfBirth: _dateFormatter(data?.dateOfBirth),
        fatherName: data?.fatherName,
        motherName: data?.motherName,
        email: data?.email,
        contactNumber: data?.contactNumber,
        alternativeContactNumber: data?.alternativeContactNumber,
      };
      setter(payload);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};
