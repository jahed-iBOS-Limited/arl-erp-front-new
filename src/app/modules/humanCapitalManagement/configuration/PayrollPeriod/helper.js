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
      `/hcm/PayrollPeriod/PayrollPeriodLandingPagination?AccountId=${accId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
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
    .get(`/hcm/PayrollPeriod/GetPayrollPeriodById?PayrollPeriodId= ${id}`)
    .then((res) => {
      const { data, status } = res;
      if (status === 200 && data) {
        setter(data);
      }
    });
};

export function saveCreateData(data, cb, setDisabled) {
  setDisabled(true);
  axios.post("/hcm/PayrollPeriod/CreatePayrollPeriod", data).then((res) => {
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
  axios.put("/hcm/PayrollPeriod/EditPayrollPeriod", data).then((res) => {
    const { data, status } = res;
    if (status === 200 && data) {
      toast.success(data.message);
      setDisabled(false);
    }
  });
}
