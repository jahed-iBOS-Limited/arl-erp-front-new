import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../../../_helper/_dateFormate";

export const monthDDL = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

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

export const getHRPositionDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetHRPositionDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getDesignationDDLAction = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetDesignationWithBusinessUnitDDL?BusinessUnitId=${buId}&AccountId=${accId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getEmployeeGradeDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetEmployeeGradeDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getEmpTypeDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetEmploymentTypeWithAccountBusinessUnitDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    console.log(error);
  }
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
export const getEmployeeBasicInfoById_api = async (
  fromReRegistration = false,
  employeeId,
  setter,
  setIsConsolidatedEmpRemu,
  setBasicDataSave
) => {
  try {
    // we used employee basic info form for create employee info, and also for re registration, so when user comes from re registration page, we will use another API to load user previous data,

    let API = fromReRegistration
      ? `/hcm/EmployeeBasicInformation/GetInactiveEmployeeBasicInfoById?EmployeeId=${employeeId}`
      : `/hcm/EmployeeBasicInformation/GetEmployeeBasicInfoById?EmployeeId=${employeeId}`;

    const res = await axios.get(API);

    if (res.status === 200 && res.data) {
      const data = res.data[0];

      const modifyGridData = {
        employeeId: data?.employeeId,
        firstName: data?.employeeFullName,
        // middleName: data?.employeeMiddleName,
        // lastName: data?.employeeLastName,
        businessUnit: {
          value: data?.businessUnitId,
          label: data?.businessUnitName,
        },
        gender: data?.genderId
          ? { value: data?.genderId, label: data?.gender }
          : "",
        email: data?.email,
        SBUName: { value: data?.sbuid, label: data?.sbuName },
        costCenter: { value: data?.costCenterId, label: data?.costCenterName },
        functionalDepartment: {
          value: data?.functionalDepartmentId,
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
        superVisor: data?.supervisorId
          ? {
              value: data?.supervisorId,
              label: data?.supervisorName,
            }
          : "",
        employeeCode: data?.employeeCode,
        employmentType: {
          value: data?.employmentTypeId,
          label: data?.employmentTypeName,
        },
        confirmationDate: _dateFormatter(data?.confirmationDate),
        employeeStatus: {
          value: data?.employmentStatusId,
          label: data?.employmentStatusName,
        },
        nanagerInfo: data?.lineManagerCode,
        dateOfJoining: _dateFormatter(data?.joiningDate),
        basicSalary: data?.basicSalary || "",
        grossSalary: data?.grossSalary || "",
        code: data?.employeeCode,
        religion: data?.religionId
          ? { value: data?.religionId, label: data?.religion }
          : "",
      };
      setIsConsolidatedEmpRemu(data?.isConsolidated);
      setter(modifyGridData);
      setBasicDataSave({
        ...modifyGridData,
        joiningDate: _dateFormatter(data?.joiningDate),
      });
    }
  } catch (error) {}
};

export const EditEmployeeBasicInformation = async (payload, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.put(
      "/hcm/EmployeeBasicInformation/EditEmployeeBasicInformationIBOS",
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

export const getLineManagersDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetLineManagerWithACCandBusDDL?BusinessUnitId=${buId}&AccountId=${accId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};
