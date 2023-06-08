import React, { useState } from "react";
import Form from "./Form";
import IForm from "../../../../_helper/_form";
import { currentMonthInitData } from "../../../../_helper/_currentMonth";

const date = new Date();
const year = date.getFullYear();

let initData = {
  bu : [{value : 0, label: "All"}],
  workplaceGroup: {value : 0, label: "All"},
  month: currentMonthInitData(date),
  year: {value: year, label: year},
};

export function SalaryDetailsReport() {
  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Salary Details"}
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
