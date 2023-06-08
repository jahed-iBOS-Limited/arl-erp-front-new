import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const empCreateAndUpdateAction = async (
  accId,
  userId,
  values,
  setLoading,
  cb
) => {
  try {
    const payload = {
      employeeId: values?.employee?.value || 0,
      erpEmployeeId: 0,
      categoryId: values?.category?.value || 0,
      categoryName: values?.category?.label || "",
      employeeCode: values?.code,
      employeeFullName: values?.employeeName,
      accountId: accId,
      businessunitId: values?.businessUnit?.value,
      sbuId: values?.sbu?.value,
      departmentId: values?.department?.value,
      designationId: values?.designation?.value,
      positionId: values?.position?.value || 0,
      joiningDate: values?.dateOfJoining,
      supervisorId: values?.supervisor?.value,
      lineManagerId: values?.lineManager?.value,
      workplaceGroupId: values?.workplaceGroup?.value,
      workplaceId: values?.workplace?.value,
      empGradeId: values?.grade?.value,
      empGradeName: values?.grade?.label,
      employmentTypeId: values?.employmentType?.value,
      employmentStatusId: values?.employeeStatus?.value,
      actionBy: userId,
      basicSalary: +values?.basicSalary,
      grossSalary: +values?.grossSalary,
      confirmationDate: values?.confirmationDate || null,
      genderId: values?.gender?.value,
      gender: values?.gender?.label,
      religionId: values?.religion?.value,
      religion: values?.religion?.label,
      cardNo: values?.cardNo || "",
      lastIncrementDate: values?.lastPromotionDate || null,
      bankId: values?.bank?.value,
      bankName: values?.bank?.label,
      bankBranchId: values?.branch?.value,
      bankBranchName: values?.branch?.label,
      accountNumber: values?.accountNo,
      districtId: values?.district?.value,
      districtName: values?.district?.label,
      payInBank: values?.payInBank || 0,
      officialEmail: values?.officialEmail || "",
      personalEmail: values?.personalEmail || "",
      isUser: values?.isUser?.label === "Yes",
      sectionId: values?.function?.value || 0,
      sectionName: values?.function?.label || "",
      subSectionId: values?.subFunction?.value || 0,
      subSectionName: values?.subFunction?.label || "",
    };
    setLoading(true);
    const res = await axios.post(
      `/hcm/EmployeeBasicInformation/EmployeeCreateUpdate`,
      payload
    );
    setLoading(false);

    if (
      res?.data?.message === "Employee exists with this code" ||
      res?.data?.message === "User exists with this email"
    ) {
      toast.warn(res?.data?.message);
    } else {
      cb();
      toast.success(res?.data?.message || "Successful");
    }
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};

export const getEmpInfoByIdAction = async (
  employee,
  values,
  setValues,
  setDisabled,
  getWorkplaceAndSBU,
  getFunctionAndSubFunction,
  getGradeAction,
  getBankDDLAction
) => {
  try {
    setDisabled(true);
    const res = await axios.get(
      `/hcm/EmployeeBasicInformation/GetEmployeeInformation?EmployeeId=${employee?.value}`
    );
    setDisabled(false);

    const {
      strEmployeeFullName,
      strEmployeeCode,
      strCardNo,
      strDepartmentName,
      intDepartmentId,
      intDesignationId,
      strDesignationName,
      strReligion,
      intReligionId,
      intBusinessunitId,
      strBusinessUnitName,
      intWorkplaceGroupId,
      strWorkplaceGroupName,
      strWorkplaceName,
      intWorkplaceId,
      intEmploymentTypeId,
      strEmploymentType,
      intGenderId,
      strGender,
      joiningDate,
      strSupervisorName,
      intSupervisorId,
      intLineManagerId,
      strLineManagerName,
      numBasicSalary,
      numGrossSalary,
      intEmpGradeId,
      strEmpGradeName,
      numPayInBank,
      dteConfirmationDate,
      dteLastIncrementDate,
      strBankName,
      intBankId,
      strBankBranchName,
      intBankBranchId,
      strAccountNumber,
      strDistrictName,
      intDistrictId,
      intEmploymentStatusId,
      strEmploymentStatus,
      intSBUId,
      strSBUName,
      personalEmail,
      officialEmail,
      isUser,
      intPositionId,
      strPositionName,
      // positionGroupId,
      // positionGroupName,
      sectionId,
      sectionName,
      subSectionId,
      subSectionName,
      categoryId,
      categoryName,
    } = res?.data?.[0];

    setValues({
      ...values,
      function:
        sectionId && sectionName
          ? {
              value: sectionId,
              label: sectionName,
            }
          : "",
      category:
        categoryId && categoryName
          ? {
              value: categoryId,
              label: categoryName,
            }
          : "",
      subFunction:
        subSectionId && subSectionName
          ? {
              value: subSectionId,
              label: subSectionName,
            }
          : "",
      employee: employee,
      employeeName: strEmployeeFullName || "",
      code: strEmployeeCode || "",
      cardNo: strCardNo || "",
      officialEmail: officialEmail || "",
      personalEmail: personalEmail || "",
      position:
        intPositionId && strPositionName
          ? {
              value: intPositionId,
              label: strPositionName,
            }
          : "",
      // positionGroup:
      //   positionGroupId && positionGroupName
      //     ? {
      //         value: positionGroupId,
      //         label: positionGroupName,
      //       }
      //     : "",
      department: intDepartmentId && strDepartmentName
        ? {
            value: intDepartmentId,
            label: strDepartmentName,
          }
        : "",
      isUser: isUser
        ? {
            value: 1,
            label: "Yes",
          }
        : {
            value: 2,
            label: "No",
          },
      designation: intDesignationId && strDesignationName
        ? {
            value: intDesignationId,
            label: strDesignationName,
          }
        : "",
      religion: intReligionId && strReligion
        ? {
            value: intReligionId,
            label: strReligion,
          }
        : "",
      businessUnit: intBusinessunitId && strBusinessUnitName
        ? {
            value: intBusinessunitId,
            label: strBusinessUnitName,
          }
        : "",
      sbu: intSBUId && strSBUName
        ? {
            value: intSBUId,
            label: strSBUName,
          }
        : "",
      workplaceGroup: intWorkplaceGroupId && strWorkplaceGroupName
        ? {
            value: intWorkplaceGroupId,
            label: strWorkplaceGroupName,
          }
        : "",
      workplace: intWorkplaceId && strWorkplaceName
        ? {
            value: intWorkplaceId,
            label: strWorkplaceName,
          }
        : "",
      employmentType: intEmploymentTypeId && strEmploymentType
        ? {
            value: intEmploymentTypeId,
            label: strEmploymentType,
          }
        : "",
      gender: intGenderId && strGender
        ? {
            value: intGenderId,
            label: strGender,
          }
        : "",
      employeeStatus: intEmploymentStatusId && strEmploymentStatus
        ? {
            value: intEmploymentStatusId,
            label: strEmploymentStatus,
          }
        : "",
      dateOfJoining: joiningDate ? _dateFormatter(joiningDate) : "",

      supervisor: intSupervisorId && strSupervisorName
        ? {
            value: intSupervisorId,
            label: strSupervisorName,
          }
        : "",

      lineManager: intLineManagerId && strLineManagerName
        ? {
            value: intLineManagerId,
            label: strLineManagerName,
          }
        : "",
      basicSalary: numBasicSalary || 0,
      grossSalary: numGrossSalary || 0,
      grade: intEmpGradeId && strEmpGradeName
        ? {
            value: intEmpGradeId,
            label: strEmpGradeName,
          }
        : "",

      payInBank: numPayInBank || 0,
      bank: intBankId && strBankName
        ? {
            value: intBankId,
            label: strBankName,
          }
        : "",
      branch: intBankBranchId && strBankBranchName
        ? {
            value: intBankBranchId,
            label: strBankBranchName,
          }
        : "",
      district: intDistrictId && strDistrictName
        ? {
            value: intDistrictId,
            label: strDistrictName,
          }
        : "",
      accountNo: strAccountNumber || "",
      confirmationDate: dteConfirmationDate
        ? _dateFormatter(dteConfirmationDate)
        : "",
      lastPromotionDate: dteLastIncrementDate
        ? _dateFormatter(dteLastIncrementDate)
        : "",
    });
    // load workplace, sbu , function , sub function ddl for edit
    getWorkplaceAndSBU(intBusinessunitId);
    getFunctionAndSubFunction(intDepartmentId, sectionId);
    if(categoryId){
      getGradeAction(categoryId);
    }

    if(intBankId){
      getBankDDLAction(intBankId)
    }
    
  } catch (error) {
    setDisabled(false);
  }
};

export const getFunctionDDLAction = async (departmentId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetSectionByBusinessUnitDepartmentDDL?BusinessUnitId=${buId}&DeptId=${departmentId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getSubFunctionDDLAction = async (functionId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetSubSectionBySectionDDL?SectionId=${functionId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
