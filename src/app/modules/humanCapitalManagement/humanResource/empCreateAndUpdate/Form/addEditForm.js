/* eslint-disable eqeqeq */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { empCreateAndUpdateAction } from "../helper";
import { toast } from "react-toastify";

const initData = {
  employee: "",
  employeeName: "",
  code: "",
  cardNo: "",
  position: "",
  function: "",
  subFunction: "",
  category: "",
  department: "",
  designation: "",
  religion: "",
  businessUnit: "",
  sbu: "",
  workplaceGroup: "",
  workplace: "",
  employmentType: "",
  gender: "",
  employeeStatus: "",
  dateOfJoining: "",
  shift: "",
  supervisor: "",
  roster: "",
  lineManager: "",
  basicSalary: "",
  grossSalary: "",
  grade: "",
  payInBank: "",
  bank: "",
  branch: "",
  district: "",
  accountNo: "",
  confirmationDate: "",
  lastPromotionDate: "",
  officialEmail : "",
  personalEmail : "",
  isUser: "",
};
export default function EmpCreateAndUpdate({ title, isUpdate }) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [singleData, setSingleData] = useState("");

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (isUpdate && !values?.employee?.value)
      return toast.warn("Employee is required");

    let cardNo = `${values?.cardNo}`
    if(cardNo?.length > 0 && cardNo?.[0] == 0){
      return toast.warn("Zero not allowed in first place for Card No");
    }
    empCreateAndUpdateAction(
      profileData?.accountId,
      profileData?.userId,
      values,
      setDisabled,
      cb
    );
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <IForm
      title={title}
      getProps={setObjprops}
      isHiddenBack={true}
      // isHiddenSave={isUpdate}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        isUpdate={isUpdate}
        setDisabled={setDisabled}
      />
    </IForm>
  );
}
