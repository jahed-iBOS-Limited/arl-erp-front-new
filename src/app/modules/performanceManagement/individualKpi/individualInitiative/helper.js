import axios from "axios";
import { toast } from "react-toastify";
// import { toast } from "react-toastify";

export const getEmployeeDDLAction = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );

    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getYearDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/pms/CommonDDL/YearDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );

    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getBscDDLAction = async (setter) => {
  try {
    let res = await axios.get(`/pms/CommonDDL/BSCPerspectiveDDL`);
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getObjectiveDDLAction = async (empId, bscId, yearId, setter) => {
  try {
    let res = await axios.get(
      `/pms/ActionPlan/GetObjectiveListByBsc?employeeId=${empId}&bscId=${bscId}&yearId=${yearId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getStrategicDataAction = async (
  empId,
  bscId,
  yearId,
  objId,
  setLoading,
  setter,
  setCurrentItem
) => {
  try {
    setLoading(true);
    let res = await axios.get(
      `/pms/ActionPlan/GetActionPlanByBscAndObj?employeeId=${empId}&bscId=${bscId}&yearId=${yearId}&objectiveId=${objId}`
    );
    setter(res?.data);
    let data = {...res?.data?.kpiWithActivityList?.[0]}
    setCurrentItem(data);
    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

export const saveStrategicInitiativeRowAction = async (payload, setLoading) => {
  try {
    setLoading(true);
    let res = await axios.put(
      `/pms/StrategicParticulars/UpdateStrategicInitiative`,
      payload
    );
    setLoading(false);
    toast.success(res?.data?.message || "Updated successfully");
  } catch (err) {
    setLoading(false);
    toast.error(
      err?.response?.data?.message || "Something went wrong, Try again"
    );
  }
};

export const getStatudDDLAction = async (setter) => {
  try {
    let res = await axios.get(
      `/pms/StrategicParticulars/GetInitiativeStatusDDL`
    );

    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const actionPlanSaveAction = async (payload) => {
  try {
    let res = await axios.post(`/pms/ActionPlan/SaveActionPlan`, payload);
    toast.success(res?.data?.message || "Submitted Successfully")
  } catch (err) {
    toast.warn(err?.response?.data?.message || "Failed, try again")
  }
};
