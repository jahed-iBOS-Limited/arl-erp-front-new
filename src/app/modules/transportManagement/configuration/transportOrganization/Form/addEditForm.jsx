/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  editTransportOrganization,
  getTransportOrganizationView,
  saveTransportOrganization,
} from "../helper";
import { useParams } from "react-router-dom";
import Loading from "../../../../_helper/_loading";

const initData = {
  transportOrganizationName: "",
  code: "",
};

export default function TransportOrganizationCreateForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const params = useParams();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (id) {
      getTransportOrganizationView(id, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // eslint-disable-next-line no-unused-vars
  const [singleData, setSingleData] = useState("");

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        const payload = {
          transportOrganizationId: +params?.id,
          transportOrganizationCode: values?.code,
          transportOrganizationName: values?.transportOrganizationName,
        };
        editTransportOrganization(payload);
      } else {
        const payload = {
          strTransportOrganizationCode: values?.code,
          strTransportOrganizationName: values?.transportOrganizationName,
          intAccountId: profileData?.accountId,
        };
        saveTransportOrganization(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
      
    }
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  return (
    <IForm
      title="Create Transport Organization"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        // disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
      />
    </IForm>
  );
}
