/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState} from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";

const initData = {};

export default function BulkBankReceive({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        // const payload = {};
      } else {
        // const payload = {};
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
      title="Bulk Bank Receive"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
      />
    </IForm>
  );
}
