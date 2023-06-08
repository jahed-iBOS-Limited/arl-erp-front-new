import React, { useState } from "react";
import IForm from "../../../../_helper/_form";
import Form from "./Form";

let initData = {
  businessUnit: { value: 0, label: "All" },
  workplaceGroup: { value: 0, label: "All" },
  workplace: { value: 0, label: "All" },
};

export function EarnLeaveReport() {
  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Earn Leave Report"}
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
