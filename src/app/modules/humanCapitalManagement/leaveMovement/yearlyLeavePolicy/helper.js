import Axios from "axios";
import { toast } from "react-toastify";

export const getPositionDDL = async (accId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetPositionWithAccountIdDDL?AccountId=${accId}`
    );
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getEmploymentTypeDDLAction = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetEmploymentTypeWithAccountBusinessUnitDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
    console.log(error.message);
  }
};

export const getLeaveTypeDDL = async (checkId, accId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetLeaveTypeDDL?check=${checkId}&accountId=${accId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      setter(data);
    }
  } catch (error) {}
};

export const saveYearlyLeavePolicy = async (
  data,
  cb,
  setDisabled,
  profileData,
  values,
  selectedBusinessUnit
) => {
  if (!values?.employmentType || !values?.year)
    return toast.warn("Please fill up employment type and year");

  setDisabled(true);
  let newData = data?.filter((item) => item?.autoId > 0 || item?.leaveDays > 0);
  let newDataTwo = newData?.map((item) => ({
    autoId: item?.autoId,
    employmentTypeId: values?.employmentType?.value,
    allocatedLeave: +item?.leaveDays,
    yearId: values?.year?.value,
    leaveTypeId: item?.leaveTypeId,
    accountId: profileData?.accountId,
    businessUnitId: selectedBusinessUnit?.value,
  }));
  try {
    const res = await Axios.post(
      `/hcm/YearlyLeaveConfig/CreateEmploymentTypeWiseLeaveBalance`,
      newDataTwo
    );
    toast.success(res.data?.message || "Submitted successfully");
    cb();
    setDisabled(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const GetYearlyLeavePolicyPagination = async (
  buId,
  accId,
  setter,
  setLoader,
  pageNo,
  pageSize,
  search
) => {
  setLoader(true);
  const searchPath = search ? `${search}` : "";
  try {
    const res = await Axios.get(
      `/hcm/YearlyLeaveConfig/GetYearlyLeavePolicySearchPagination?AccountId=${accId}&BusinesUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}&Search=${searchPath}`
    );
    if (res.status === 200 && res?.data?.data) {
      setter(res?.data);
      setLoader(false);
    }
  } catch (error) {
    setLoader(false);
  }
};

// export const GetYearlyLeavePolicyInfo = async (
//   buId,
//   accId,
//   positionId,
//   empTypeId,
//   setter

// ) => {

//   try {
//     const res = await Axios.get(
//       `/hcm/YearlyLeaveConfig/GetYearlyLeaveTypeInfo?BusinessUnitId=${buId}&AccountId=${accId}&PositionId=${positionId}&EmployementTypeId=${empTypeId}`
//     );
//     if (res.status === 200 && res?.data) {
//       console.log(res?.data, "jjjj")
//       setter(res?.data);

//     }
//   } catch (error) {

//   }
// };

export const GetYearlyLeavePolicyInfo = async (
  buId,
  accId,
  yearId,
  empTypeId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/hcm/YearlyLeaveConfig/GetEmploymentTypeWiseLeaveBalance?AccountId=${accId}&BusinessUnitId=${buId}&EmploymentTypeId=${empTypeId}&Year=${yearId}`
    );
    const modifiedData = res?.data?.map((item) => ({
      ...item,
      leaveDays: item?.allocatedLeave,
    }));
    setter(modifiedData);
  } catch (error) {
    setter([]);
    toast.error(
      error?.response?.data?.message || "Something went wrong, try again"
    );
  }
};

export const getSingleDataById = async (
  empMentTypeId,
  yearId,
  buId,
  setRowDto
) => {
  try {
    const res = await Axios.get(
      `/hcm/YearlyLeaveConfig/GetLeavePolicyById?EmploymentTypeId=${empMentTypeId}&YearId=${yearId}&BusinessunitId=${buId}`
    );
    setRowDto(res?.data);
  } catch (error) {
    setRowDto([]);
    toast.error(error?.response?.data?.message);
  }
};

export const saveEditedYearlyLeavePolicy = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/hcm/YearlyLeaveConfig/EditYearlyLeave`, data);
    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

// Helper End
