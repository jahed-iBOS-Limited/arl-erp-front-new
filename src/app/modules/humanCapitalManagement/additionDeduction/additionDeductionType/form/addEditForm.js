/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import Form from "./form";
import { useSelector, shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import IForm from "./../../../../_helper/_form";
import { createAdditionDeductionType } from "../helper";

const initData = {
  strType: "",
  strComments: "",
  addDeType: "",
};

const AdditionDeductionTypeForm = () => {
  const location = useLocation();
  // Salary Type from state
  const { type } = location?.state;

  const [isDisabled, setDisabled] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // Save Handler
  const saveHandler = (values, cb) => {
    if (profileData?.accountId) {
      // Create
      let payload = {
        isAddition: values?.addDeType?.value === 1 ? true : false,
        strType: values?.strType,
        strComments: values?.strComments,
        intAccountId: profileData?.accountId,
        intActionBy: profileData?.userId,
      };
      createAdditionDeductionType(payload, setDisabled, cb);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <>
      <IForm
        title="Create Addition/Deduction Type"
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          type={type}
        />
      </IForm>
    </>
  );
};

export default AdditionDeductionTypeForm;
