import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { toast } from "react-toastify";
import { employeeTaxAssignAction } from "../helper";

let initData = {
  employee: "",
  amount: "",
};

export function TaxAssignForm() {
  const [isDisabled, setDisabled] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (!values?.employee) return toast.warn("Employee is required");
    if (!values?.amount) return toast.warn("Amount is required");
    if (+values?.amount < 1) return toast.warn("Please add positive amount");
    employeeTaxAssignAction(
      values,
      selectedBusinessUnit?.value,
      profileData?.userId,
      setDisabled,
      cb
    );
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"TAX Amount Assign"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form {...objProps} initData={initData} saveHandler={saveHandler} />
      </div>
    </IForm>
  );
}
