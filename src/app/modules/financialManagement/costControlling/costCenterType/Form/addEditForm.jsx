/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import Form from "./form";
import {
  saveCostCenterTypeData,
  getControllingUnitById,
  setControllingUnitSingleEmpty,
  saveEditedCostCenterTypeData,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import { getControllingUnitDDLAction } from "../../../../_helper/_redux/Actions";
import Loading from "./../../../../_helper/_loading";

const initData = {
  id: undefined,
  costCentertypeName: "",
  controllingUnit: "",
};

export default function CostCenterTypeForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get controlUnitName List ddl from store
  const controllingUnitDDL = useSelector((state) => {
    return state?.commonDDL?.controllingDDL;
  }, shallowEqual);

  // get single controlling  unit from store
  const controllingUnit = useSelector((state) => {
    return state.costCenterType?.singleData;
  }, shallowEqual);
  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      dispatch(getControllingUnitById(id));
    } else {
      dispatch(setControllingUnitSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // //Dispatch get controlling unit name for dropdown
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getControllingUnitDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const saveHandler = async (values, cb) => {
    
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          costCenterTypeId: +id,
          costCenterTypeName: values.costCenterTypeName,
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          actionBy: profileData.userId,
          controllingUnitId: values.controllingUnit?.value,
          lastActionDateTime: "2020-08-19T08:18:34.030Z",
          active: true,
        };
        dispatch(saveEditedCostCenterTypeData(payload, setDisabled));
      } else {
        const payload = {
          costCenterTypeName: values.costCenterTypeName,
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          actionBy: profileData.userId,
          controllingUnitId: values.controllingUnit?.value,
          lastActionDateTime: "2020-08-19T08:18:34.030Z",
          active: true,
        };
        dispatch(saveCostCenterTypeData({ data: payload, cb, setDisabled }));
      }
    } else {
      setDisabled(false);
      
    }
  };

  const [objProps, setObjprops] = useState({});
  return (
    <IForm
      title="Create Cost Center Type"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={controllingUnit || initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        controllingUnitDDL={controllingUnitDDL}
        isEdit={id || false}
      />
    </IForm>
  );
}
