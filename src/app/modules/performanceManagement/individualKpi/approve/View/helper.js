import Axios from "axios";
import { toast } from "react-toastify";

export const saveDailyTargetRow = async (data, cb) => {
  const newData = data?.map((item) => ({ ...item, amount: +item?.amount }));

  try {
    const res = await Axios.put(
      `/pms/KPI/UpdatePMSIndividualKPIApprove`,
      newData
    );
    if (res?.status === 200) {
      // cb = when save daily target, dispatch header target Again,
      cb();
      toast.success(res.data?.message || "Submitted successfully");
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};

export const getDailyTargetData = async (kpiId, monthId, setter) => {
  // set empty initially
  setter([]);
  try {
    const res = await Axios.get(
      `/pms/KPI/GetEmployeeDailyAchivemenById?kpiid=${kpiId}&monthid=${monthId}`
    );
    if (res?.status === 200) {
      const newData = res?.data?.map((item) => ({
        ...item,
        amount: item?.amount,
      }));

      setter(newData);
    }
  } catch (error) {
    setter([]);
    
  }
};

export const getEmployeeNameBySupervisorDDL_api = async (
  accountId,
  buId,
  userId,
  departmentId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/pms/CommonDDL/EmployeeNameBySupervisorDepartmentWiseDDL?AccountId=${accountId}&BusinessUnitId=${buId}&UserId=${userId}&DepartmentId=${departmentId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
