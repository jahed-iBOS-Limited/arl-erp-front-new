/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";

let initData = {};

export function CreateIssueForProduction() {
  const [isDisabled, setDisabled] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {};

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Create Issue for Production"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form {...objProps} initData={initData} saveHandler={saveHandler} />
      </div>
    </IForm>
  );
}
