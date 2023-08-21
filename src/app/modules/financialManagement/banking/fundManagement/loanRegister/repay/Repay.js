import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { createRepay } from "../../helper";
import RepayForm from "./Form";

const initData = {
  account: "",
  instrumentNo: "",
  instrumentDate: _todayDate(),
  principalAmount: "",
  interestAmount: "",
  transDate: _todayDate(),
};

export default function RepayCreate({
  history,
  match: {
    params: { id },
  },
}) {
  const [objProps, setObjprops] = useState({});
  const [isDisabled] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const singleData = useSelector((state) => {
    return state.costControllingUnit?.singleData;
  }, shallowEqual);



  const saveHandler = async (values, cb) => {
    console.log(values);
    createRepay(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      +id,
      values?.account?.value,
      0,
      values?.instrumentNo,
      values?.instrumentDate,
      +values?.principalAmount,
      +values?.interestAmount,
      values?.transDate,
      profileData?.userId,
      cb
    );
  };

  return (
    <IForm
      //   title={`View Loan Register`}
      customTitle={`Repay Loan Register`}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <RepayForm
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
      />
    </IForm>
  );
}
