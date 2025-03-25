/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  createSalesTargetConfig,
  getSingleSalesTargetConfig,
  editSalesTargetConfig,
} from "../helper";
import { useParams } from "react-router-dom";
import Loading from "../../../../_helper/_loading";

const initData = {
  entryDay: "",
  editedDay: "",
  approvalStatus: false,
};

export default function SalesTargetConfigForm() {
  const params = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [singleData, setSingleData] = useState("");

  // get user profile data from store
   const { profileData, selectedBusinessUnit } = useSelector(
      (state) => state?.authData,
      shallowEqual
    );

  useEffect(() => {
    if (params?.id) {
      getSingleSalesTargetConfig(params?.id, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (values, cb) => {
    setDisabled(true);

    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        const payload = {
          autoId: params?.id,
          lastTargetEntryDay: values.entryDay,
          lastTargetEditDay: values.editedDay,
          // isApproveRequired: values.approvalStatus,
          actionBy: profileData?.userId,
          // isActive: true,
        };

     
        editSalesTargetConfig(payload, setDisabled);
      } else {
        const payload = {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          lastTargetEntryDay: values.entryDay,
          lastTargetEditDay: values.editedDay,
          isApproveRequired: values.approvalStatus,
          actionBy: profileData?.userId,
        };

        createSalesTargetConfig(payload, cb, setDisabled);
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
      title="Create Sales Target Config"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={params?.id || false}
        disableHandler={disableHandler}
      />
    </IForm>
  );
}
