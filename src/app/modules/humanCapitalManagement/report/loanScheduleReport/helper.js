import axios from "axios";

export const getEmployeeDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/EmployeeInfoDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const getLoanData = (enrolId, setter, setLoader) => {
  setLoader(true);
  axios
    .get(`/hcm/HCMLoanReport/GetLoanReport?PartId=1&Enroll=${enrolId}`)
    .then((res) => {
      const { data } = res;
      setter(data);
      setLoader(false);
    })
    .catch((err) => setter(""));
};

export const getLoanDetails = async (loanId, setter) => {
  // console.log(loanId)
  try {
    const res = await axios.get(
      `/hcm/LoanApplication/GetLoanScheduleByLAId?LoanApplicationId=${loanId}`
    );
    setter(res.data);
  } catch (error) {
    setter("");
  }
};
