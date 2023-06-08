import Axios from "axios";
import { toast } from "react-toastify";

export const saveDailyTargetRow = async (data, cb) => {
  const newData = data?.map((item) => ({ ...item, amount: +item?.amount }));

  try {
    const res = await Axios.put(
      `/pms/KPI/UpdateEmployeeDailyAchivement`,
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

export const getEmployeeApproveAndActiveByKPIId = async (
  kpiId,
  setDisabled
) => {
  try {
    const res = await Axios.get(
      `/pms/KPI/GetEmployeeApproveAndActiveByKPIId?KpiId=${kpiId}`
    );
    if (res.status === 200 && res?.data) {
      // setDisabled(res?.data?.approved ==="false");
      setDisabled(res?.data?.approved);
    }
  } catch (error) {
    
  }
};
