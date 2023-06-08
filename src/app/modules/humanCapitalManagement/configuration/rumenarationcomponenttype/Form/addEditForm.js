/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { saveRumenarationComponentType,getRumenarationComponentTypeById,editHRRumenarationComponentType } from "../helper";

let initData = {
  remunerationComponentType: "",
  remunerationComponentTypeCode: ""};
export function HRRumenarationComponentTypeForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);
  const [businessTypeDDl, setBusinessTypeDDL] = useState("");
  const [singleData, setSingleData] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store;
  // const selectedBusinessUnit = useSelector((state) => {
  //   return state.authData.selectedBusinessUnit;
  // }, shallowEqual);

  useEffect(() => {
    getRumenarationComponentTypeById(id, setSingleData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values) {
      if (id) {
        const payload = {
         remunerationComponentTypeId: +id,
         remunerationComponentTypeName: values?.remunerationComponentType,
         actionBy: profileData?.userId
        };
        editHRRumenarationComponentType(payload,cb)
      } else {
        const payload = {
          remunerationComponentType:
            values?.remunerationComponentType,
          remunerationComponentTypeCode: values?.remunerationComponentTypeCode,
          accountId: profileData?.accountId,
          actionBy: profileData?.userId
        };
        saveRumenarationComponentType(payload, cb);
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
      title={
        id
          ? "Edit Remuneration Component Type"
          : "Create Remuneration Component Type"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <div className="mt-0">
        <Form
          {...objProps}
          initData={id? singleData: initData}
          saveHandler={saveHandler}
          disableHandler={disableHandler}
          businessTypeDDl={businessTypeDDl}
          isEdit={id || false}
        />
      </div>
    </IForm>
  );
}
