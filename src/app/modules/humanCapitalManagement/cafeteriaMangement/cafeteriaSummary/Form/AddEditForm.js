/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./Form";
import IForm from "../../../../_helper/_form";

import { _todayDate } from "../../../../_helper/_todayDate";
import Loading from "../../../../_helper/_loading";

let initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

export function CafeteriaSummaryReport({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (values) {
      if (id) {
        // const payload = {};
      } else {
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Cafeteria Summary Report"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenSave={true}
      isHiddenReset={true}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          isEdit={id ? id : false}
          id={id}
          profileData={profileData}
          selectedBusinessUnit={selectedBusinessUnit}
        />
      </div>
    </IForm>
  );
}
