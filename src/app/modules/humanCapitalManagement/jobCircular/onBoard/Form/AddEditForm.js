/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import {
  getEmployeeNameDDL,
  getLoanReport,
  getLoanTypeDDL,
  saveLoanReschedule,
} from "../helper";

import Form from "./Form";

let initData = {
  enrollId:"",
  employeeName: "",
  designation: "",
  department: "",
  unit: "",
  loanAmount: "",
  loanType: "",
  numberOfInstallment: "",
  installmentAmount: "",
  remarks:""
};

export default function LoanRescheduleForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [loanTypeDDl, setLoanTypeDDl] = useState([]);
  const [employeeNameDDl, setemployeeNameDDl] = useState([]);

  
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getLoanTypeDDL(setLoanTypeDDl);
  }, []);

 
  useEffect(() => {
    getEmployeeNameDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setemployeeNameDDl
    );
  }, [profileData,selectedBusinessUnit]);
  const saveHandler = async (values, cb) => {
    

    let payload = {
      applicationId:values?.applicationId,
      loanTypeId: values?.loanType.value,
      userId:values?.employeeName.value,
      loanAmount: values?.loanAmount,
      numberOfInstallment: values?.numberOfInstallment,
      installmentAmount: values?.installmentAmount,
    };

    saveLoanReschedule(payload, cb, setDisabled);
  };

  return (
    <IForm
      title="Loan Reschedule"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
       {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        loanTypeDDl={loanTypeDDl}
        employeeNameDDl={employeeNameDDl}
        saveHandler ={saveHandler}
      />
    </IForm>
  );
}
