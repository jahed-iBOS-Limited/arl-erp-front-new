/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import Form from "./form";
import { _todayDate } from './../../../../../../_helper/_todayDate';

const initData = {
  employmentActivity: "",
};

export default function EmploymentInformation() {
  const [rowDto, setRowDto] = useState([1]);
  const [edit, setEdit] = useState(false);
  
  const [isDisabled, setDisabled] = useState(true);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values.length) {
    } else {
      setDisabled(false);
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };


  

  return (
    <div className="employeeInformation">
      <Form
        initData={initData}
        disableHandler={disableHandler}
        saveHandler={saveHandler}
        setEdit={setEdit}
        edit={edit}
        rowDto={rowDto}
      />
    </div>
  );
}
