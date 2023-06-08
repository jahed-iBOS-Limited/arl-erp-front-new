/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./Form";
import IForm from "../../../../_helper/_form";

import { _todayDate } from "../../../../_helper/_todayDate";

let initData = {
  reportType:{value:1, label:"Daily"},
  fromDate: _todayDate(),
  toDate: _todayDate(),
  businessUnit: {value : 0, label: "All"},
  consumePlace:""
};

export function CafeteriaDetailsReport({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);
  // const [summaryReportData, setSummaryReportData] = useState([]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit} = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
 

  // get selected business unit from store
  // const selectedBusinessUnit = useSelector((state) => {
  //   return state.authData.selectedBusinessUnit;
  // }, shallowEqual);

  const saveHandler = async (values, cb) => {
    setDisabled(true);

    if (values) {
      if (id) {
        // const payload = {};
      } else {
      }
    } else {
      setDisabled(false);
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Cafeteria Details Report"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          disableHandler={disableHandler}
          isEdit={id ? id : false}
          id={id}
          profileData={profileData}
          selectedBusinessUnit = {selectedBusinessUnit}
        />
      </div>
    </IForm>
  );
}
