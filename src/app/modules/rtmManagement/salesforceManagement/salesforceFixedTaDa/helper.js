import Axios from "axios";
import { toast } from "react-toastify";

// Real

export const createSalesForceTaDa = async (payload, cb, setDisabled) => {
  try {
    setDisabled(true);

    const res = await Axios.post(
      `/rtm/SalesforceTADASetup/CreateSalesforceTADASetup`,
      payload
    );
    if (res.status === 200 && res?.data) {
      toast.success(res.data?.message || "Created successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const editSalesForceTaDa = async (payload, setDisabled) => {
  try {
    setDisabled(true);
    const res = await Axios.put(
      `/rtm/SalesforceTADASetup/EditSalesforceTADASetup`,
      payload
    );
    if (res.status === 200 && res?.data) {
      toast.success(res.data?.message || "Edited successfully");
      // cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getSalesForceTaDaById = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/SalesforceTADASetup/GetSalesforceTADASetupById?salesForceTADASetupId=${id}`
    );
    if (res.status === 200 && res?.data) {
      const values = res?.data[0];

      const data = {
        ...values,
        employeeFullName: values.employeeName,
        monthlyTaAmount: values.taamount,
        monthlyDaAmount: values.daamount,
      };
      setter(data);
    }
  } catch (error) {}
};

export const getGridData = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/SalesforceTADASetup/SalesforceTADASetupPasignation?accountId=${accId}&businessUnitid=${buId}&PageNo=1&PageSize=111&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

//
export const getEmployeeDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/EmployeeInfoDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getEmployeeDetails = async (empId, cb) => {
  try {
    const res = await Axios.get(
      `/pms/KPI/GetEmployeeBasicInfoById?EmployeeId=${empId}`
    );
    console.log("res?.data", res?.data);
    if (res.status === 200 && res?.data) {
      // setter(res?.data);
      cb(res.data);
    }
  } catch (error) {
    // console.log("error", error?.response?.data)
    toast.warn(error?.response?.data?.Message, { toastId: "gederr" });
  }
};
