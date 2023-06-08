import React, { useState } from "react";
import Form from "./Form";
import IForm from "../../../../_helper/_form";
import { _todayDate } from "../../../../_helper/_todayDate";

let initData = {
  date: _todayDate(),
  workplaceGroup: "",
};

export function EmpOverallStatus() {
  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Employee Overall Status"}
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
