/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import Form from "./form";

const initData = {
  profitCenter: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

export function ProfitCenterReport() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Profit Center Report"}
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
