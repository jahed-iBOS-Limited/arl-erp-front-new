import Axios from "axios";
import { toast } from "react-toastify";
import { _todayDate } from "../../../../_helper/_todayDate";

export const getEmployeeDDL = async (accId, busId, setter, setLoader) => {
  setLoader(true);
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/EmployeeInfoDDL?AccountId=${accId}&BusinessUnitId=${busId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data.map((itm) => {
        return {
          ...itm,
          value: itm?.value,
          label: itm?.label,
          // name: itm?.label
        };
      });
      setter(data);
      setLoader(false);
    }
  } catch (error) {
    setLoader(false);
  }
};

export const getLoanData = (enrolId, setter, setLoader) => {
  setLoader(true);
  Axios.get(`/hcm/HCMLoanReport/GetLoanReport?PartId=1&Enroll=${enrolId}`).then(
    (res) => {
      const { data, status } = res;
      if (status === 200 && data) {
        const newData = data.map((itm) => {
          return {
            ...itm,
            approveLoanAmount: itm?.intLoanAmount,
            approveNumberOfinstallment: itm?.intInstallment,
            dteEffectiveDate: _todayDate(),
          };
        });
        setter(newData);
        setLoader(false);
      }
    }
  );
};

export const loanApproveAction = async (
  partId,
  applicationId,
  loanTypeId,
  userId,
  loanAmount,
  numberOfinstallment,
  approveLoanAmount,
  approveNumberOfinstallment,
  effectiveDate,
  remarks
) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMLoanReport/GetLoanApproveAndReScheduleProcess?PartId=${partId}&ApplicationId=${applicationId}&LoanTypeId=${loanTypeId}&UserID=${userId}&LoanAmount=${loanAmount}&NumberOfInstallment=${numberOfinstallment}&ApproveLoanAmount=${approveLoanAmount}&ApproveNumberOfInstallment=${approveNumberOfinstallment}&EffectiveDate=${effectiveDate}&Remarks=${remarks}`
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Loan approve successfully");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const loanRejectedAction = async (id, updateRowDto, setRowDto) => {
  try {
    const res = await Axios.put(
      `/hcm/LoanApplication/CancelLoanApplication?LoanApplication=${id}`
    );
    if (res.status === 200) {
      toast.success(
        res.data?.message || "Loan application cancel successfully"
      );
      setRowDto(updateRowDto);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
