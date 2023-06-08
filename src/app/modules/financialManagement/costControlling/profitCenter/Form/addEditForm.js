/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  getControllingUnitDDL_api,
  GetProfitCenterView,
  getResponsiblePersonDDL_api,
  saveEditedProfitCenter,
  saveProfitCenter,
} from "../helper";
import { useParams } from "react-router-dom";

const initData = {
  profitCenterName: "",
  profitCenterCode: "",
  profitCenterGroupName: "",
  controllingUnitName: "",
  responsiblePersonName: "",
};

export default function ProfitCenterForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);
  const [objProps, setObjprops] = useState({});
  const [controllingUnitDDL, setControllingUnitDDL] = useState("");
  const [profitCenterGroupNameDDL, setProfitCenterGroupNameDDL] = useState("");
  const [responsiblePersonDDL, setResponsiblePersonDDL] = useState("");

  const params = useParams();

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

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getControllingUnitDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setControllingUnitDDL
      );
      getResponsiblePersonDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setResponsiblePersonDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);

  // get value addition view data
  useEffect(() => {
    if (params?.id) {
      GetProfitCenterView(params?.id, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        const payload = {
          profitCenterId: params?.id,
          profitCenterGroupId: values?.profitCenterGroupName?.value,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          controllingUnitId: values?.controllingUnitName?.value,
          responsiblePersonId: values?.responsiblePersonName?.value,
          actionBy: profileData?.userId,
        };
        saveEditedProfitCenter(payload);
      } else {
        const payload = {
          profitCenterName: values?.profitCenterName,
          profitCenterCode: values?.profitCenterCode,
          profitCenterGroupId: values?.profitCenterGroupName?.value,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          controllingUnitId: values?.controllingUnitName?.value,
          responsiblePersonId: values?.responsiblePersonName?.value,
          actionBy: profileData?.userId,
        };
        saveProfitCenter(payload, cb);
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
      title="Create Profit Center"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit?.value}
        controllingUnitDDL={controllingUnitDDL}
        responsiblePersonDDL={responsiblePersonDDL}
        profitCenterGroupNameDDL={profitCenterGroupNameDDL}
        setProfitCenterGroupNameDDL={setProfitCenterGroupNameDDL}
        isEdit={id ? true : false}
      />
    </IForm>
  );
}
