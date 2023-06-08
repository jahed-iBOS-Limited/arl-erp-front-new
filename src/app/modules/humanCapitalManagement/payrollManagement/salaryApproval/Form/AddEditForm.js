import React, { useState } from "react";
import Form from "./Form";
import IForm from "../../../../_helper/_form";
import "../topSheetCustom.css";
import { currentMonthInitData } from "../../../../_helper/_currentMonth";

const date = new Date();
const year = date.getFullYear();

let initData = {
  month: currentMonthInitData(date),
  year: { value: year, label: year },
  workplaceGroup: "",
  positionGroup: "",
};

export function SalaryApprovalReport() {
  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Salary Approval"}
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
