/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  GetValueAdditionView,
  saveEditedValueAddition,
  saveValueAddition,
} from "../helper";
import Loading from "../../../../_helper/_loading";

const initData = {
  valueAdditionName: "",
};
// const params = useParams();
// console.log("params", params);
export default function ValueAdditionForm({
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
  console.log(id);
  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          actionBy: +profileData?.userId,
          valueAdditionId: +id,
          valueAdditionName: values?.valueAdditionName,
          businessUnitId: +selectedBusinessUnit?.value,
          businessUnitName: selectedBusinessUnit?.label,
          accountId: profileData?.accountId,
        };
        saveEditedValueAddition(payload, setDisabled);
      } else {
        const payload = {
          actionBy: +profileData?.userId,
          valueAdditionId: +id,
          valueAdditionName: values.valueAdditionName,
          businessUnitId: +selectedBusinessUnit.value,
          businessUnitName: selectedBusinessUnit.label,
          accountId: profileData?.accountId,
        };
        saveValueAddition(payload, cb, setDisabled);
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
      title="Create Value Addition"
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
