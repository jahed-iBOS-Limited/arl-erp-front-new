/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState } from "react";
import Form from "./form";
import IForm from "../../../../_helper/_form";

import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "./../../../../_helper/_loading";
import { createAccountingClosing } from "./../helper";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  businessUnit: "",
};

export default function AccountClosingCreateForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});

  // get user profile data from store
  const {
    selectedBusinessUnit,
    profileData: { accountId, userId },
  } = useSelector((store) => store?.authData, shallowEqual);

  const saveHandler = (values, cb) => {
    // console.log(values?.currentPeriodEndDate);
    const payload = {
      accountId: accountId,
      businessUnitId: selectedBusinessUnit?.value,
      currentPeriodStartDate: values?.currentPeriodEndDate,
      currentPeriodEndDate: values?.currentPeriodEndDate,
      actionBy: userId,
    };
    createAccountingClosing(payload, cb, setDisabled);
  };

  return (
    <IForm
      title="Accounting Closing"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        accountId={accountId}
      />
    </IForm>
  );
}
