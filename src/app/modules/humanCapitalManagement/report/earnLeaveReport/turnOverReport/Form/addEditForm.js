import React, { useState } from "react";
import IForm from "../../../../../_helper/_form";
import { _todayDate } from "../../../../../_helper/_todayDate";
import Form from "./Form";
import "./style.css";

let initData = {
  businessUnit:{ value : 0, label: "All"},
  fromDate:_todayDate(),
  toDate:_todayDate(),
  
};

export function TurnOverReport() {
  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Turnover Report"}
      getProps={setObjprops}
      isHiddenReset={true}
      isHiddenBack={true}
      isHiddenSave={true}
    >
      <div className="mt-0">
        <Form {...objProps} initData={initData} />
      </div>
    </IForm>
  );
}
