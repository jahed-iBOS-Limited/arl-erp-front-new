/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Form from "./form";
import { useParams } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import IForm from "./../../../../_helper/_form";
import { useSelector, shallowEqual } from "react-redux";

import {
  createBusinessType,
  getOutletTypeById,
  editBusinessType,
} from "../helper";

const initData = {
  businessTypeName: "",
  isOnlyTmsAllowed: false,
};

const OutletBusinessTypeForm = () => {
  const { id } = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState("");

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
      getOutletTypeById(id, setDisabled, setSingleData);
    }
  }, [id]);

  // Save Handler
  const saveHandler = (values, cb) => {
    if (!id) {
      let payload = {
        businessTypeName: values?.businessTypeName,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        actionBy: profileData?.userId,
        isOnlyTmsAllowed: values?.isOnlyTmsAllowed,
      };
      createBusinessType(payload, setDisabled, cb);
    } else {
      let payload = {
        businessTypeId: +id,
        businessTypeName: values?.businessTypeName,
        actionBy: profileData?.userId,
        isOnlyTmsAllowed: values?.isOnlyTmsAllowed,
      };
      editBusinessType(payload, setDisabled, cb);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <>
      <IForm
        title={!id ? "Create Outlet Type" : "Edit Outlet Type"}
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={singleData || initData}
          saveHandler={saveHandler}
          profileData={profileData}
          selectedBusinessUnit={selectedBusinessUnit}
          setDisabled={setDisabled}
          isEdit={id}
        />
      </IForm>
    </>
  );
};

export default OutletBusinessTypeForm;
