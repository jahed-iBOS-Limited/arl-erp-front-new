import axios from "axios";
import { toast } from "react-toastify";

export const getBuDDL = async (userId, accountId, setter) => {
  try {
    const res = await axios.get(
      `/domain/OrganizationalUnitUserPermission/GetBusinessUnitPermissionbyUser?UserId=${userId}&ClientId=${accountId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      const newData = data.map((item) => {
        return {
          value: item.organizationUnitReffId,
          label: item.organizationUnitReffName,
        };
      });
      setter(newData);
    }
  } catch (error) {
    
  }
};
// create extend
export const saveEmpGroupExtend = async (createData, cb) => {
  try {
    const res = await axios.post(
      // `/hcm/EmployeeConfigure/CreateEmployeeGroupName`,
      `hcm/EmployeeConfigure/CreateEmployeeGroupExtend`,
      createData
    );
    if (res?.status === 200 && res?.data) {
      toast.success(res?.data?.message || "Save Successfully");
      cb();
    }
  } catch (error) {
   
  }
};
// landing

export const getEmployeeGroupNameLanding = async (accountId, setter) => {
  try {
    const res = await axios.get(
      `hcm/EmployeeConfigure/GetEmployeeGroupNameLanding?AccountId=${accountId}&PageNo=1&PageSize=10000`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data?.data);
    }
  } catch (error) {
    
  }
};
// get by ID
//
export const getEmployeeGroupNameById = async (empGroupId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/EmployeeConfigure/GetEmployeeGroupNameById?EmployeeGroupId=${empGroupId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};
// create group name
export const createEmployeeGroupNew = async (createData, cb) => {
  try {
    const res = await axios.post(
      `/hcm/EmployeeConfigure/CreateEmployeeGroupNew`,
      createData
    );
    if (res?.status === 200 && res?.data) {
      toast.success(res?.data?.message || "Save Successfully");
      cb();
    }
  } catch (error) {
   
  }
};
