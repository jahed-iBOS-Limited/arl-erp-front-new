/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import Form from "./form";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

export function FinencialRatiosAnalysis() {
  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Financial Ratios"}
      getProps={setObjprops}
      isHiddenSave
      isHiddenReset
      isHiddenBack
    >
      <Form {...objProps} initData={initData} />
    </IForm>
  );
}
