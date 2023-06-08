import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import Form from "./form";
import { createSalaryPayInBankAmountEntry, getEmployeeDDL } from "./../helper";
import { toast } from "react-toastify";

const initData = {
  employeeName: "",
  amount: "",
};

export default function SalaryPayInBankForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [employeeDDL, setEmployeeDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getEmployeeDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setEmployeeDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  // Save Handler
  const saveHandler = (values, cb) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      if (!values?.employeeName) return toast.warn("Employee is required");
      if (!values?.amount) return toast.warn("Amount is required");
      if (+values?.amount < 1) return toast.warn("Please add positive amount");
      const payload = {
        employeeId: values?.employeeName?.value,
        amount: values?.amount,
        actionBy: profileData?.userId,
      };
      createSalaryPayInBankAmountEntry(payload, setDisabled, cb);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <>
      <IForm
        title={"Create Salary Pay In Bank"}
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          profileData={profileData}
          selectedBusinessUnit={selectedBusinessUnit}
          employeeDDL={employeeDDL}
        />
      </IForm>
    </>
  );
}
