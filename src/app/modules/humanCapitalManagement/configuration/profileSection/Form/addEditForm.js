/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  GetValueAdditionView,
  EditProfileSection,
  saveProfileSection,
} from "../helper";
import Loading from "../../../../_helper/_loading";

const initData = {
  profileSectionName: "",
};

export default function ProfileSectionCreateForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //SingleData to view
  const [singleData, setSingleData] = useState("");

  // get value addition view data
  useEffect(() => {
    if (id) {
      GetValueAdditionView(id, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          sl: 0,
          intProfileSectionId: +id,
          strProfileSection: values?.profileSectionName,
          intAccountId: profileData?.accountId,
          intBusinessUnitId: +selectedBusinessUnit?.value,
          strBusinessUnit: selectedBusinessUnit?.label,
          intActionBy: profileData?.userId,
          dteLastActionDateTime: "2021-02-20T10:03:07.650Z",
          dteServerDateTime: "2021-02-20T10:03:07.650Z",
          isActive: true,
        };
        EditProfileSection(payload, setDisabled);
      } else {
        const payload = {
          sl: 0,
          intProfileSectionId: 0,
          strProfileSection: values?.profileSectionName,
          intAccountId: profileData?.accountId,
          intBusinessUnitId: +selectedBusinessUnit?.value,
          strBusinessUnit: selectedBusinessUnit?.label,
          intActionBy: profileData?.userId,
          dteLastActionDateTime: "2021-02-20T08:38:23.058Z",
          dteServerDateTime: "2021-02-20T08:38:23.058Z",
          isActive: true,
        };
        saveProfileSection(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
      
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <IForm
      title="Create Profile Section"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
      />
    </IForm>
  );
}
