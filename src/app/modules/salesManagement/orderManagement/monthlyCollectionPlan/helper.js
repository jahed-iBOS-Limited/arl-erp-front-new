import axios from "axios";
import { toast } from "react-toastify";
import { getMonth } from "../../report/salesanalytics/utils";

export const getMonthlyCollectionPlanData = async (
  typeId,
  accId,
  buId,
  empId,
  setter,
  setLoading,
  values
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/oms/CustomerSalesTarget/GetDueByCustomer?Type=${typeId}&EmployeeId=${empId}&AccountId=${accId}&BusinessUnitId=${buId}`
    );

    const modifyData = res?.data?.map((item) => ({
      ...item,
      area: values?.areaName,
      territory: values?.territoryName,
      od: (item?.overDue / item?.dueAmount) * 100,
      week1: "",
      week2: "",
      week3: "",
      week4: "",
      total: "",
      percent: "",
      isSelected: false,
    }));
    const data = typeId === 1 ? modifyData : res?.data;
    setter(data);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getEmployeeRAT = async (salesManId, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/oms/CustomerSalesTarget/GetEmployeeWiseRAT?SalesManId=${salesManId}`
    );
    cb(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const deleteMonthlyCollectionPlan = async (id, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(
      `/oms/CustomerSalesTarget/DeleteMonthlyCollectionPlan?CollectionPlanId=${id}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const weekList = (monthId) => {
  const lastDates = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const month = getMonth(monthId).slice(0, 3);
  const week1 = `1-7-${month}`;
  const week2 = `8-14-${month}`;
  const week3 = `15-21-${month}`;
  const week4 = `22-${lastDates[monthId - 1]}-${month}`;
  return [week1, week2, week3, week4];
};
