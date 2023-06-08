/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  editOrganizationComponent,
  getOrganizationComponentById,
  saveOrganizationComponent,
} from "../helper";
import Loading from "../../../../_helper/_loading";

let initData = {
  orgComponentCode: "",
  orgComponentName: "",
};
export function OrganizationComponentForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  // const selectedBusinessUnit = useSelector((state) => {
  //   return state.authData.selectedBusinessUnit;
  // }, shallowEqual);

  useEffect(() => {
    getOrganizationComponentById(id, setSingleData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (data, cb) => {
    if (data) {
      if (id) {
        let payload = [
          {
            orgComponentId: +id,
            orgComponentCode: data?.orgComponentCode,
            orgComponentName: data?.orgComponentName,
            accountId: profileData?.accountId,
            actionBy: profileData?.userId
          },
        ];
       
        editOrganizationComponent(payload, setDisabled);
      } else {
        let payload = data.map((item) => ({
          ...item,
          accountId: profileData?.accountId,
          actionBy: profileData?.userId,
        }));
        saveOrganizationComponent(payload, cb, setDisabled);
      }
    } else {
      
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={
        id ? "Edit Organization Component" : "Create Organization Component"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <div className="mt-0">
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={id ? singleData : initData}
          saveHandler={saveHandler}
          disableHandler={disableHandler}
          isEdit={id || false}
        />
      </div>
    </IForm>
  );
}
