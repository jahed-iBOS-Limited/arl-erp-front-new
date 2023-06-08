import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  getEmpDDLAction,
  saveControllingUnit,
  saveEditedControllingUnit,
  getControllingUnitById,
  setControllingUnitSingleEmpty,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import Loading from "./../../../../_helper/_loading";

const initData = {
  id: undefined,
  controllingUnitCode: "",
  controllingUnitName: "",
  responsiblePerson: "",
};

export default function CostControllingForm({
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

  // get emplist ddl from store
  const empDDL = useSelector((state) => {
    return state?.costControllingUnit?.empDDL;
  }, shallowEqual);

  // get single controlling  unit from store
  const singleData = useSelector((state) => {
    return state.costControllingUnit?.singleData;
  }, shallowEqual);

  const dispatch = useDispatch();

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getControllingUnitById(id));
    } else {
      dispatch(setControllingUnitSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getEmpDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          controllingUnitId: +id,
          controllingUnitCode: values?.controllingUnitCode,
          controllingUnitName: values?.controllingUnitName,
          responsiblePerson:
            values?.responsiblePerson?.employeeId ||
            singleData?.responsiblePerson?.value,
          actionBy: profileData?.userId,
          businessUnitId: selectedBusinessUnit?.value,
          accountId: profileData?.accountId,
        };
        dispatch(saveEditedControllingUnit(payload, setDisabled));
      } else {
        const payload = {
          controllingUnitCode: values?.controllingUnitCode,
          controllingUnitName: values?.controllingUnitName,
          responsiblePerson: values?.responsiblePerson?.employeeId,
          actionBy: profileData?.userId,
          businessUnitId: selectedBusinessUnit?.value,
          accountId: profileData?.accountId,
        };
        dispatch(saveControllingUnit({ data: payload, cb, setDisabled }));
      }
    } else {
      console.log(values);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create Controlling Unit"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        empDDL={empDDL}
        isEdit={id || false}
      />
    </IForm>
  );
}
