import Axios from "axios";
import { toast } from "react-toastify";
import { _todayDate } from "../../../_helper/_todayDate";

export const getEmployeeDDL = async (accId, busId, setter) => {
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
    }
  } catch (error) {}
};

export const getLoanData = async (enrolId, setter, setLoader) => {
  setLoader(true);
  try {
    const res = await Axios.get(
      `/hcm/HCMLoanReport/GetLoanReport?PartId=1&Enroll=${enrolId}`
    );

    const { data } = res;
    setLoader(false);
    const newData = data.map((itm) => ({
      ...itm,
      approveLoanAmount: itm?.intLoanAmount,
      approveNumberOfinstallment: itm?.intInstallment,
      dteEffectiveDate: _todayDate(),
    }));
    setter(newData);
  } catch (error) {
    setLoader(false);
  }
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
  remarks,
  getData
) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMLoanReport/GetLoanApproveAndReScheduleProcess?PartId=${partId}&ApplicationId=${applicationId}&LoanTypeId=${loanTypeId}&UserID=${userId}&LoanAmount=${loanAmount}&NumberOfInstallment=${numberOfinstallment}&ApproveLoanAmount=${approveLoanAmount}&ApproveNumberOfInstallment=${approveNumberOfinstallment}&EffectiveDate=${effectiveDate}&Remarks=${remarks}`
    );
    getData && getData();
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
