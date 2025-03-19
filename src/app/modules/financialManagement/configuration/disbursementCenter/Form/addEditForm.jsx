/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import Loading from "./../../../../_helper/_loading";

import IForm from "../../../../_helper/_form";
import {
  createDisbursementCenter_api,
  getDisbursementcenterById_api,
  getSBUListDDL_api,
  editDisbursementCenter_api,
} from "./../helper";

const initData = {
  id: undefined,
  disbursementCenter: "",
  sbu: "",
  disbursementCenterCode: "",
};

export default function DisbursementCenterForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [sbuDDL, setSbuDDL] = useState([]);
  const [singleData, setSingleData] = useState([]);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = [
          {
            disbursementCenterId: +id,
            disbursementCenterCode: values?.disbursementCenterCode,
            disbursementCenterName: values?.disbursementCenter,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            sbuid: values?.sbu?.value,
            sbuname: values?.sbu?.label,
            actionBy: profileData.userId,
          },
        ];
        editDisbursementCenter_api(payload, setDisabled);
      } else {
        const payload = {
          disbursementCenterCode: values?.disbursementCenterCode,
          disbursementCenterName: values?.disbursementCenter,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          businessUnitName: selectedBusinessUnit?.label,
          sbuid: values?.sbu?.value,
          sbuname: values?.sbu?.label,
          actionBy: profileData.userId,
        };
        createDisbursementCenter_api(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
      
    }
  };

  const [objProps, setObjprops] = useState({});

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getSBUListDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSbuDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (id) {
      getDisbursementcenterById_api(id, setSingleData);
    }
  }, [id]);

  return (
    <IForm
      title="Create Disbursement Center"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        isEdit={id || false}
        sbuDDL={sbuDDL}
      />
    </IForm>
  );
}
