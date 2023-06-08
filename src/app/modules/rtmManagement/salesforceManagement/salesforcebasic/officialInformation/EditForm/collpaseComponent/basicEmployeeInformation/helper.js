import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../../../../_helper/_dateFormate";

export const getCostCenterDDL = async (accId, buId, sbuId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/CostCenter/GetCostCenterDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getBusinessUnitDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetBusinessunitDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getSBUDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetSBUDDL?AccountId=${accId}&BusineessUnitId=${buId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getWorkplaceDDL_api = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/WorkPlace/GetWorkPlace?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res.status === 200 && res.data) {
      const modfid = res?.data?.map((item) => ({
        value: item?.workplaceId,
        label: item?.workplaceName,
        code: item?.workplaceCode,
        workplaceGroupId: item?.workplaceGroupId,
      }));
      setter(modfid);
    }
  } catch (error) {}
};
export const getDepartmentDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetDepartmentDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getHRPositionDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetHRPositionDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getDesignationDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetDesignationDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getEmployeeGradeDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetEmployeeGradeDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getEmpTypeDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetEmploymentTypeDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getEmpStatusDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetEmployeeStatusDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};
export const getLineManagerDDL = async (accId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetLineManagerDDL?AccountId=${accId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

//create EmployeeBasicInformation
export const createEmpBasicInformation_api = async (data, cb) => {
  try {
    const res = await axios.post(
      `/hcm/EmployeeBasicInformation/CreateEmployeeBasicInformation`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");

      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const employeeBasicInformation_landing_api = async (
  accId,
  buId,
  setter
) => {
  try {
    const res = await axios.get(
      `/hcm/EmployeeBasicInformation/EmployeeBasicInfoLandingPasignation?Accountid=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=1&PageSize=100`
    );

    if (res.status === 200 && res.data) {
      setter(res.data?.data);
    }
  } catch (error) {}
};
export const getEmployeeBasicInfoById_api = async (employeeId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/SalesForceInformation/GetSalesForceInfoById?EmployeeId=${employeeId}`
    );

    if (res.status === 200 && res.data) {
      const data = res.data[0];

      const modifyGridData = {
        employeeId: data?.employeeId,
        firstName: data?.employeeFirstName,
        middleName: data?.middleName,
        lastName: data?.lastName,
        businessUnit: {
          value: data?.businessunitId,
          label: data?.businessunitName,
        },
        SBUName: { value: data?.sbuid, label: data?.sbuName },
        costCenter: { value: data?.costCenterId, label: data?.costCenterName },
        functionalDepartment: {
          value: data?.departmentId,
          label: data?.departmentName,
        },
        HRposition: { value: data?.positionId, label: data?.positionName },
        designation: {
          value: data?.designationId,
          label: data?.designationName,
        },
        employeeGrade: {
          value: data?.empGradeId,
          label: data?.empGradeName,
        },
        workplace: {
          value: data?.workplaceId,
          label: data?.workplaceName,
          workplaceGroupId: data?.workplaceGroupId,
          code: data?.workplaceCode,
        },
        lineManager: data?.lineManagerId
          ? {
              value: data?.lineManagerId,
              label: data?.lineManagerName,
              code: data?.lineManagerCode,
            }
          : "",
        employeeCode: data?.employeeCode,
        employmentType: {
          value: data?.employmentTypeId,
          label: data?.employmentTypeName,
        },
        employeeStatus: {
          value: data?.employeeStatusId,
          label: data?.employeeStatusName,
        },
        nanagerInfo: data?.lineManagerCode,
        joiningDate: _dateFormatter(data.joiningDate),
        empLavel: {
          value: data?.employeeLevel,
          label: data?.employeeLevelName,
        },
        empProfileImage: data?.empProfileImage,
      };
      setter(modifyGridData);
    }
  } catch (error) {}
};

export const EditEmployeeBasicInformation = async (payload, setDisabled) => {
  try {
    const res = await axios.put(
      "/rtm/SalesForceInformation/EDitSalesForceInfo",
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
