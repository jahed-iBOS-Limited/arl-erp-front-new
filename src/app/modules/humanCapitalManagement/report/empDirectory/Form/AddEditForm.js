import React, { useState } from "react";
import Form from "./Form";
import IForm from "../../../../_helper/_form";

let initData = {
  bu : [{value : 0, label: "All"}],
  workplaceGroup: {value : 0, label: "All"},
};

export function EmpDirectory() {
  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Employee Directory"}
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
