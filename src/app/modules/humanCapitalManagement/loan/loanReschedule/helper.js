import Axios from "axios";
import { toast } from "react-toastify";

export const getLoanData = (
  enrolId,
  setter,
  setLoader
) => {
  setLoader(true);
  Axios
    .get(
      `/hcm/HCMLoanReport/GetLoanReport?PartId=1&Enroll=${enrolId}`
    )
    .then((res) => {
      const { data, status } = res;

      if (status === 200 && data) {
        setter(data);
        setLoader(false);
      }
    });
};

export const loanApproveAction = async (
  
  applicationId,
  loanTypeId,
  userId,
  loanAmount,
  numberOfinstallment,
  approveLoanAmount,
  approveNumberOfinstallment,
  effectiveDate,
  remarks,
  setRowDto
) => {
  try {
   
    const res = await Axios.get(
      `/hcm/HCMLoanReport/GetLoanApproveAndReScheduleProcess?PartId=2&ApplicationId=${applicationId}&LoanTypeId=${loanTypeId}&UserID=${userId}&LoanAmount=${loanAmount}&NumberOfInstallment=${numberOfinstallment}&ApproveLoanAmount=${approveLoanAmount}&ApproveNumberOfInstallment=${approveNumberOfinstallment}&EffectiveDate=${effectiveDate}&Remarks=${remarks}`
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Loan Rescheduled successfully");
      setRowDto(res.data);
      
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    
  }
};





