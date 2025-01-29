/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import Form from "./form";
import { performanceGuaranteeCreate } from "../helper";

import { _todayDate } from "../../../../_helper/_todayDate";
import * as Yup from "yup";
import { toast } from "react-toastify";

const initData = {
  pgAmount: "",
  pgDueDate: _todayDate(),
  paymentDate: _todayDate(),
  exchangeRate: "",
  pgAmountBDT: "",
};
//Dropdown loading finish

export const validationSchema = Yup.object().shape({
  exchangeRate: Yup.number()
    .positive("Exchange Rate must be positive")
    .min(1, "Minimum Value is 1")
    .required("Exchange Rate is required"),
  pgAmount: Yup.number()
    .positive("PG Amount must be positive")
    .min(1, "Minimum Value is 1")
    .required("PG Amount is required"),
});
export default function AddEditForm({
  documentReleaseValue,
  singleItem,
  setIsShowModal,
  cb,
}) {
  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const saveHandler = async (values) => {
    if (values?.pgAmount) {
      const payload = {
        sbuId: singleItem?.sbuId,
        plantId: singleItem?.plantId,

        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        poId: singleItem?.poId,
        poNumber: values?.poNumber,
        lcId: singleItem?.lcId,
        lcNumber: values?.lcNumber,
        pgDueDate: values?.pgDueDate,
        paymentDate: values?.paymentDate,
        shipmentId: values?.shipmentId,
        exchangeRate: values?.exchangeRate,
        pgAmountFC: values?.pgAmount,
        pgAmountBDT: values?.pgAmountBDT,
      };
      return performanceGuaranteeCreate(
        payload,
        setDisabled,
        setIsShowModal,
        cb
      );
    } else {
      return toast.warn("Please fill all field");
    }
  };
  return (
    <IForm
      title="Performance Guarantee"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={true}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={{
          ...initData,
          ...singleItem,
          pgDueDate: _dateFormatter(singleItem?.pgDueDate),
          pgAmount: singleItem?.pgAmount,
        }}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        singleItem={singleItem}
        validationSchema={validationSchema}
      />
    </IForm>
  );
}
