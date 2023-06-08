import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import {
  editLoanApplication,
  getLoanApplicationById,
  saveLoanAppAction,
} from "../helper";
import Form from "./Form";

let initData = {
  id: undefined,
  employeeName: "",
  loanType: "",
  loanAmount: "",
  numberOfInstallment: "",
  installmentAmount: "",
  strReferenceNo: "",
};

export default function LoanForm({
  history,
  match: {
    params: { id, applicationId },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState("");

  // Get profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // Get Selected Business unit data from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      getLoanApplicationById(id, applicationId, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, applicationId]);

  const [objProps, setObjprops] = useState({});

  const saveHandler = (values, cb) => {
    if (values && selectedBusinessUnit && profileData) {
      if (+values?.loanAmount < +values?.installmentAmount)
        return toast.error(
          "Loan amount must be greater than or equal to installment amount"
        );

      // if (
      //   values?.installmentAmount * values?.numberOfInstallment !==
      //   +values?.loanAmount
      // )
      //   return toast.error("Invalid installment amount equation");

      if (id) {
        const payload = [
          {
            loanApplicationId: +applicationId,
            loanTypeId: values?.loanType?.value,
            loanAmount: +values?.loanAmount,
            numberOfInstallment: +values?.numberOfInstallment,
            strReferenceNo: values?.strReferenceNo || "",
          },
        ];
        editLoanApplication(payload, setDisabled);
      } else {
        const payload = [
          {
            employeeId: values?.employeeName?.value,
            loanTypeId: values?.loanType?.value,
            loanAmount: +values?.loanAmount,
            numberOfInstallment: +values?.numberOfInstallment,
            numberOfInstallmentAmount: +values?.installmentAmount,
            strReferenceNo: values?.strReferenceNo || "",
            intApproveBy: 0,
            approveLoanAmount: 0,
            approveNumberOfInstallment: 0,
            rejectBy: 0,
          },
        ];
        saveLoanAppAction(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  return (
    <IForm
      title="Create Loan Application"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id}
      />
    </IForm>
  );
}
