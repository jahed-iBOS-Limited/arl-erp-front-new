import axios from "axios";
import { toast } from "react-toastify";

export const getEisenhowerMatrixValue = async (
  employeeId,
  yearId,
  quarterId,
  setLoading,
  setRowDto
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/pms/PerformanceMgmt/GetEisenhowerMatrix?EmployeeId=${employeeId}&YearId=${yearId}&QuarterId=${quarterId}`
    );
    setLoading && setLoading(false);

    if (res?.data) {
      setRowDto && setRowDto(res?.data);
      
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

// get yearDDL

export const getYearDDL = async (accId, setYearDDl) => {
  const res = await axios.get(
    `/pms/CommonDDL/YearDDL?AccountId=${accId}&BusinessUnitId=4`
  );

  if (res?.data) {
    setYearDDl && setYearDDl(res?.data);
  }
};

// create
export const addWorkPlan = async (payload, cb, setDisabled) => {
  console.log("line 7", payload);
  try {
    setDisabled && setDisabled(true);
    const res = await axios.post(
      `/pms/PerformanceMgmt/PMSWorkPlanCreateAndEdit`,
      payload
    );
    setDisabled && setDisabled(false);
    if (res.status === 200) {
      toast.success("Created successfully");
      cb();
    }
  } catch (error) {
    setDisabled && setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

// landing
export const workPlan_landing_api = async (
  employeeId,
  yearId,
  quarterId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/pms/PerformanceMgmt/GetWorkPlanRowGrid?EmployeeId=${employeeId}&YearId=${yearId}&QuarterId=${quarterId}`
    );

    if (res.status === 200 && res.data) {
      const modifiedData = res?.data?.row?.map(
        (item)=>{
          return {
            ...item,
            isDisabled: true,
          }
        }
      );
      setter({
        ...res.data,
        row: modifiedData
      });
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

// https://erp.ibos.io/pms/CommonDDL/YearDDL?AccountId=1&BusinessUnitId=4

export const commonYearDDL = async (setLoading, setter) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `https://erp.ibos.io/pms/CommonDDL/YearDDL?AccountId=1&BusinessUnitId=4`
    );

    if (res.status === 200 && res.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};
