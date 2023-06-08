import React, { useState } from "react";
import Form from "./Form";
import IForm from "../../../../_helper/_form";

let initData = {
  businessUnit: "",
  workPlace: "",
};

export function WorkScheduleReport() {
  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Work Schedule"}
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
