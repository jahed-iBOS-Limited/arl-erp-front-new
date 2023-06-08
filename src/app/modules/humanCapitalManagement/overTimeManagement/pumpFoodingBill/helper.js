import axios from "axios";
import { toast } from "react-toastify";

export const getEmpInfoById = async (id, setFieldValue) => {
  try {
    let res = await axios.get(
      `/hcm/HCMDDL/GetEmployeeDetailsByEmpId?EmpId=${id}`
    );
    let { workplaceName, workplaceId } = res?.data;
    // setFieldValue("designation", employeeInfoDesignation || "");
    // setFieldValue("designationId", employeeInfoDesignationId || 0);
    setFieldValue(
      "workPlace",
      { value: workplaceId, label: workplaceName } || {}
    );
  } catch (error) {
    return null;
  }
};

export const getWorkplaceDDL_api = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/WorkPlace/GetWorkPlace?accountId=${accId}&businessUnitId=${buId}`
    );
    const modfid = res?.data?.map((item) => ({
      value: item?.workplaceId,
      label: item?.workplaceName,
      code: item?.workplaceCode,
      workplaceGroupId: item?.workplaceGroupId,
    }));
    setter(modfid);
  } catch (error) {
    setter([]);
  }
};

export const pumpFoodingBillEntry = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/hcm/MenuListOfFoodCorner/CreatePumpFoodingBill`,
      payload
    );
    toast.success(res?.data?.message);
    cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const deletePumpFoodingBill = async (id, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(
      `/hcm/MenuListOfFoodCorner/DeletePumpFoodingBill?AutoId=${id}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const approvePumpFoodingBill = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(
      `/hcm/MenuListOfFoodCorner/ApprovePumpFoodingBill`,
      payload
    );
    toast.success(res?.data?.message);
    cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
