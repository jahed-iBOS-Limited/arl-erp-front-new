/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import Form from "./form";

const initData = {
  businessUnit: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

export function CashRegisterReport() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Cash Register Report"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenSave
      isHiddenReset
      isHiddenBack
    >
      {isDisabled && <Loading />}
      <Form {...objProps} initData={initData} />
    </IForm>
  );
}
