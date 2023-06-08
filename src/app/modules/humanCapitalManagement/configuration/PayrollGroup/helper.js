import axios from "axios";
import { toast } from "react-toastify";

// get selected business unit from store

export const getLandingPageData = (
  accId,
  setter,
  setLoader,
  pageNo,
  pageSize
) => {
  setLoader(true);
  axios
    .get(
      `/hcm/PayrollGroup/PayrollGroupLandingPagination?AccountId=${accId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    )
    .then((res) => {
      const { data, status } = res;
      if (status === 200 && data) {
        setter(data);
        setLoader(false);
      }
    });
};

export const getSinglePageData = (id, setter) => {
  axios
    .get(`/hcm/PayrollGroup/GetPayrollGroupById?PayrollGroupId= ${id}`)
    .then((res) => {
      const { data, status } = res;
      if (status === 200 && data) {
        setter(data);
        console.log(data);
      }
    });
};

export function saveCreateData(data, cb, setDisabled) {
  setDisabled(true);
  axios.post("/hcm/PayrollGroup/CreatePayrollGroup", data).then((res) => {
    const { data, status } = res;
    if (status === 200 && data) {
      toast.success(data.message);

      cb();
      setDisabled(false);
    }
  });
}

export function saveEditData(data, setDisabled) {
  setDisabled(true);
  // console.log(data)
  axios.put("/hcm/PayrollGroup/EditPayrollGroup", data).then((res) => {
    const { data, status } = res;
    if (status === 200 && data) {
      toast.success(data.message);
      setDisabled(false);
    }
  });
}

export const getPayrollPeriodDdlData = (setter) => {
  axios.get("/hcm/HCMDDL/GetPayrollPeriodDDL").then((res) => {
    setter(res.data);
  });
};
