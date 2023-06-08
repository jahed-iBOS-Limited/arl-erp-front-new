/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */

import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../_chartinghelper/loading/_loading";
import { createConsignee, saveEditedConsignee } from "../helper";
import Form from "./form";

const initData = {
  consigneeName: "",
  mobileNo: "",
  email: "",
  address: "",
  bankAccountNo: "",
};

export default function ConsigneeForm({ singleData, setOpen, viewHandler }) {
  const [loading, setLoading] = useState(false);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const saveHandler = (values, cb) => {
    if (!values?.consigneeId) {
      const payload = {
        consigneeId: 0,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        consigneeName: values?.consigneeName,
        mobileNo: values?.mobileNo,
        email: values?.email,
        address: values?.address,
        bankAccountNo: values?.bankAccountNo,
        actionby: profileData?.userId,
      };
      createConsignee(payload, setLoading, () => {
        cb();
        viewHandler(0, 15);
        setOpen(false);
      });
    } else {
      const payload = {
        consigneeId: values?.consigneeId,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        consigneeName: values?.consigneeName,
        mobileNo: values?.mobileNo,
        email: values?.email,
        address: values?.address,
        bankAccountNo: values?.bankAccountNo,
        actionby: profileData?.userId,
      };
      saveEditedConsignee(payload, setLoading, () => {
        cb();
        viewHandler(0, 15);
        setOpen(false);
      });
    }
  };

  const title = singleData?.consigneeId ? "Edit Consignee" : "Create Consignee";

  return (
    <>
      {loading && <Loading />}
      <Form
        title={title}
        initData={singleData?.consigneeId ? singleData : initData}
        saveHandler={saveHandler}
        setLoading={setLoading}
      />
    </>
  );
}
