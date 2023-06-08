import axios from "axios";
import { toast } from "react-toastify";

export const monthDDL = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export const checkValidityOfFromMonthNYear = (
  fromMonth,
  fromYear,
  setFieldValue,
  yearName,
  monthName
) => {
  let date = new Date();
  let cMonth = date.getMonth() + 1;
  let currentYear = date.getFullYear();

  if (!fromMonth || !fromYear) return "";
  if (fromMonth < cMonth && fromYear <= currentYear) {
    toast.warn("Previous month or year not allowed");
    setFieldValue(`${yearName}`, "");
    setFieldValue(`${monthName}`, "");
  }
};

export const getDataByEmployeeAction = async (
  accId,
  empId,
  setDisabled,
  setter,
  pageNo,
  pageSize
) => {
  try {
    setDisabled(true);
    let res = await axios.get(
      `/hcm/EmpRemunerationAddDed/GetEmpSalaryAdditionDeductionLandingPasignation?AccountId=${accId}&EmployeeId=${empId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    const newData = res?.data?.data?.filter((item) => !item?.isProcessed);
    setter(newData);
    setDisabled(false);
  } catch (err) {
    setter([]);
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};
