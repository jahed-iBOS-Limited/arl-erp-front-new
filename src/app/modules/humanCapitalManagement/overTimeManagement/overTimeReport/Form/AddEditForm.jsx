import React, { useState } from "react";
import Form from "./Form";
import IForm from "../../../../_helper/_form";
import { _todayDate } from "../../../../_helper/_todayDate";

let initData = {
  businessUnit : "",
  workPlace: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  applicationType: "",
  viewAs: ""
};

export function OverTimeReport() {

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Overtime Report"}
      getProps={setObjprops}
      isHiddenReset={true}
      isHiddenBack={true}
      isHiddenSave={true}
    >
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
        />
      </div>
    </IForm>
  );
}
